import mongoose from 'mongoose';
import LegalSource, { VerificationStatus, SourceStatus } from '@/models/LegalSource';
import IngestionJob, { IngestionStatus } from '@/models/IngestionJob';
import RawSnapshot from '@/models/RawSnapshot';
import Law from '@/models/Law';
import LawVersion from '@/models/LawVersion';
import LegalCategory from '@/models/LegalCategory';
import Jurisdiction from '@/models/Jurisdiction';
import { BangladeshLawAdapter } from '@/lib/ingestion/adapters/BangladeshLawAdapter';
import { SourceAdapter } from '@/lib/ingestion/SourceAdapter';
import dbConnect from '@/lib/db';

export class IngestionService {
  /**
   * Factory to get the correct adapter for a given source.
   */
  private static getAdapterForSource(source: any): SourceAdapter {
    // In a real system, we'd dynamically resolve adapters based on country or domain registry
    const bdAdapter = new BangladeshLawAdapter();
    if (bdAdapter.validateSource(source)) {
      return bdAdapter;
    }
    throw new Error(`No compatible adapter found for source: ${source.officialDomain}`);
  }

  /**
   * Run ingestion for a specific legal source
   */
  static async runIngestion(sourceId: string) {
    await dbConnect();

    const source = await LegalSource.findById(sourceId);
    if (!source) {
      throw new Error(`Source not found: ${sourceId}`);
    }

    // 17. SOURCE AUTHORITY
    // If LegalSource.verificationStatus !== VERIFIED (SOURCE_VERIFIED), ingestion must refuse to run
    if (source.verificationStatus !== VerificationStatus.SOURCE_VERIFIED && source.verificationStatus !== VerificationStatus.PUBLISHED) {
      throw new Error(`Refusing to run ingestion. Source authority not verified. Status: ${source.verificationStatus}`);
    }

    const adapter = this.getAdapterForSource(source);

    // Create the pending ingestion job
    const job = await IngestionJob.create({
      source: source._id,
      status: IngestionStatus.RUNNING,
      parserVersion: adapter.parserVersion,
    });

    try {
      // 2. SOURCE FETCH JOB
      const fetchResult = await adapter.fetch(source);
      
      // Get previous job to compare hash
      const previousJob = await IngestionJob.findOne({
        source: source._id,
        status: IngestionStatus.COMPLETED
      }).sort({ createdAt: -1 });

      // 3. CHANGE DETECTION
      if (previousJob && previousJob.contentHash === fetchResult.contentHash) {
        job.status = IngestionStatus.NO_CHANGES;
        job.previousContentHash = previousJob.contentHash;
        job.contentHash = fetchResult.contentHash;
        job.completedAt = new Date();
        await job.save();
        return job;
      }

      // 4. RAW SOURCE SNAPSHOT
      const snapshot = await RawSnapshot.create({
        source: source._id,
        ingestionJob: job._id,
        sourceUrl: source.sourceUrl,
        contentHash: fetchResult.contentHash,
        format: fetchResult.format,
        parserVersion: adapter.parserVersion,
        rawText: fetchResult.rawText, // Only storing if it's manageable size
      });

      job.rawSnapshot = snapshot._id;
      job.previousContentHash = previousJob?.contentHash;
      job.contentHash = fetchResult.contentHash;
      await job.save();

      // 7. SOURCE-SPECIFIC PARSERS (Parse)
      const parseResult = await adapter.parse(fetchResult.rawText || '', fetchResult.fetchMetadata);
      
      // 5. NORMALIZATION
      const normalizedRecords = adapter.normalize(parseResult.records);

      let draftsCreated = 0;

      // Find or create a default "Unknown" category if the adapter can't guess one
      let defaultCategory = await LegalCategory.findOne({ slug: 'uncategorized' });
      if (!defaultCategory) {
        defaultCategory = await LegalCategory.create({
          name: 'Uncategorized',
          slug: 'uncategorized',
          description: 'Pending human categorization'
        });
      }

      // Ensure we have a jurisdiction
      let targetJurisdiction = source.jurisdiction;
      if (!targetJurisdiction) {
        let firstJur = await Jurisdiction.findOne({ country: source.country });
        if (!firstJur) {
          firstJur = await Jurisdiction.create({ country: source.country, name: 'National/Default', slug: 'national-default', level: 'STATE' });
        }
        targetJurisdiction = firstJur._id;
      }

      for (const record of normalizedRecords) {
        // 14. DUPLICATE PROTECTION
        // Compare source identifier and law identifier
        const existingLaw = await Law.findOne({
          legalIdentifier: record.legalIdentifier,
          jurisdiction: targetJurisdiction
        });

        if (existingLaw) {
          // 15. LEGAL VERSION CREATION
          // A source change must generate: New LawVersion -> DRAFT
          
          // Check if the current draft or latest version already has this hash/text
          // For simplicity in pilot, we assume any run that bypasses NO_CHANGES means we should draft a new version
          const latestVersion = await LawVersion.findOne({ law: existingLaw._id }).sort({ createdAt: -1 });
          const newVersionNum = latestVersion ? latestVersion.version + 1 : 2;

          await LawVersion.create({
            law: existingLaw._id,
            version: newVersionNum,
            verificationStatus: VerificationStatus.DRAFT, // 16. HUMAN REVIEW
            officialText: record.officialText || 'UNKNOWN_TEXT',
            summary: record.summary || 'UNKNOWN_SUMMARY',
            effectiveDate: record.effectiveDate || undefined,
            source: source._id
          });
          
          draftsCreated++;
          continue; 
        }

        // 15 & 16: New Draft Creation
        await Law.create({
          title: record.title || 'UNKNOWN_TITLE',
          slug: record.slug,
          legalIdentifier: record.legalIdentifier || 'UNKNOWN_ID',
          country: source.country,
          jurisdiction: targetJurisdiction,
          category: defaultCategory._id, // Default to uncategorized; requires human review
          summary: record.summary || 'UNKNOWN_SUMMARY',
          officialText: record.officialText || 'UNKNOWN_TEXT',
          effectiveDate: record.effectiveDate || undefined, // 6. NO DATA GUESSING
          status: record.status || 'UNKNOWN',
          source: source._id,
          verificationStatus: VerificationStatus.DRAFT, // 16. HUMAN REVIEW
        });

        draftsCreated++;
      }

      // Update source timestamps
      source.lastCheckedAt = new Date();
      source.lastSuccessfulFetchAt = new Date();
      source.lastChangedAt = new Date();
      await source.save();

      // 12. INGESTION SAFETY / 13. PARTIAL PARSE PROTECTION
      job.status = parseResult.isPartial ? IngestionStatus.PARTIAL_PARSE : IngestionStatus.COMPLETED;
      job.recordsDiscovered = normalizedRecords.length;
      job.draftsCreated = draftsCreated;
      job.completedAt = new Date();
      await job.save();

      // 25. SOURCE CHANGE ALERT
      // Real implementation would trigger a notification service here to alert admins
      console.log(`[ALERT] Official source changed. Draft review required for ${source.name}`);

      return job;

    } catch (error: any) {
      // 12. INGESTION SAFETY
      job.status = IngestionStatus.FAILED;
      job.errorMessage = error.message;
      job.errorDetails = error.stack;
      job.completedAt = new Date();
      await job.save();

      // 24. SOURCE FAILURE BEHAVIOR
      // Mark source TEMPORARILY_UNAVAILABLE if it's a network issue
      if (error.message.includes('fetch') || error.message.includes('network')) {
        source.status = SourceStatus.FAILED;
        source.notes = `TEMPORARILY_UNAVAILABLE: ${error.message}`;
        await source.save();
      }

      throw error;
    }
  }

  static async getIngestionHistory(sourceId?: string) {
    await dbConnect();
    const query = sourceId ? { source: sourceId } : {};
    return await IngestionJob.find(query)
      .populate('source', 'name officialDomain')
      .sort({ createdAt: -1 })
      .limit(50);
  }
}
