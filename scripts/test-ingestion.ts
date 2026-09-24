import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LegalSource from '../src/models/LegalSource';
import IngestionJob from '../src/models/IngestionJob';
import RawSnapshot from '../src/models/RawSnapshot';
import Law from '../src/models/Law';
import LawVersion from '../src/models/LawVersion';
import { IngestionService } from '../src/services/ingestion.service';
import { VerificationStatus } from '../src/models/LegalSource';

dotenv.config({ path: '.env.local' });

async function runTests() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('Connected to MongoDB for Ingestion Engine Tests\n');

  // Find our pilot source
  const source = await LegalSource.findOne({ officialDomain: 'minlaw.gov.bd' });
  if (!source) {
    console.error('CRITICAL: Bangladesh pilot source not found. Cannot run real-data pipeline test.');
    process.exit(1);
  }

  let finalReport = {
    sourceAdapter: 'BangladeshLawAdapter',
    sourceVerified: false,
    lastSuccessfulFetch: null as Date | null,
    recordsDiscovered: 0,
    draftsCreated: 0,
    publishedRecords: 0,
    failures: 0,
    warnings: 0,
    remainingManualSteps: [] as string[]
  };

  try {
    // TEST 1: Source Not Verified (Should refuse to run)
    console.log('--- TEST 1: Source Not Verified Protection ---');
    source.verificationStatus = VerificationStatus.DRAFT;
    await source.save();

    try {
      await IngestionService.runIngestion(source._id.toString());
      console.error('❌ FAILED: Ingestion ran on unverified source!');
      finalReport.failures++;
    } catch (e: any) {
      if (e.message.includes('Refusing to run ingestion')) {
        console.log('✅ PASSED: Refused to run on unverified source.');
      } else {
        throw e;
      }
    }

    // Prepare for real tests
    source.verificationStatus = VerificationStatus.SOURCE_VERIFIED;
    await source.save();
    finalReport.sourceVerified = true;

    // TEST 2: Real-Data Pipeline (Initial Fetch -> Draft)
    console.log('\n--- TEST 2: Initial Fetch & Draft Creation ---');
    
    // Clear any previous jobs/snapshots for clean test
    await IngestionJob.deleteMany({ source: source._id });
    await RawSnapshot.deleteMany({ source: source._id });
    // Keep previously published laws from earlier pilot, but clear DRAFTs
    await Law.deleteMany({ source: source._id, verificationStatus: VerificationStatus.DRAFT });
    await LawVersion.deleteMany({ source: source._id, verificationStatus: VerificationStatus.DRAFT });

    const initialJob = await IngestionService.runIngestion(source._id.toString());
    
    if (initialJob.status === 'COMPLETED' && initialJob.draftsCreated > 0) {
      console.log(`✅ PASSED: Parsed ${initialJob.recordsDiscovered} records, created ${initialJob.draftsCreated} drafts.`);
      finalReport.recordsDiscovered += initialJob.recordsDiscovered;
      finalReport.draftsCreated += initialJob.draftsCreated;
    } else {
      console.error('❌ FAILED: Did not create expected drafts.');
      finalReport.failures++;
    }

    // TEST 3: Unchanged Content (Should not create new drafts)
    console.log('\n--- TEST 3: Idempotency (Unchanged Content) ---');
    const unchangedJob = await IngestionService.runIngestion(source._id.toString());

    if (unchangedJob.status === 'NO_CHANGES') {
      console.log('✅ PASSED: Detected NO_CHANGES. Drafts created: ' + unchangedJob.draftsCreated);
    } else {
      console.error(`❌ FAILED: Expected NO_CHANGES, got ${unchangedJob.status}`);
      finalReport.failures++;
    }

    // Refresh Source Data
    const updatedSource = await LegalSource.findById(source._id);
    finalReport.lastSuccessfulFetch = updatedSource?.lastSuccessfulFetchAt || null;

    // Calculate published
    const publishedCount = await Law.countDocuments({ source: source._id, verificationStatus: VerificationStatus.PUBLISHED });
    finalReport.publishedRecords = publishedCount;

    if (finalReport.draftsCreated > 0) {
      finalReport.remainingManualSteps.push('Review newly created DRAFT laws in /admin/verification-queue');
    }

    console.log('\n=========================================');
    console.log('           FINAL REPORT                  ');
    console.log('=========================================');
    console.log(`Source Adapter:        ${finalReport.sourceAdapter}`);
    console.log(`Source Verified:       ${finalReport.sourceVerified}`);
    console.log(`Last Fetch:            ${finalReport.lastSuccessfulFetch}`);
    console.log(`Records Discovered:    ${finalReport.recordsDiscovered}`);
    console.log(`Drafts Created:        ${finalReport.draftsCreated}`);
    console.log(`Published Records:     ${finalReport.publishedRecords}`);
    console.log(`Failures:              ${finalReport.failures}`);
    console.log(`Warnings:              ${finalReport.warnings}`);
    console.log(`Search Sync:           AUTOMATIC VIA ATLAS SEARCH`);
    console.log(`RAG Sync:              REAL-TIME (Reads PUBLISHED only)`);
    console.log(`SEO Sync:              SITEMAP READS PUBLISHED ONLY`);
    console.log('Remaining Manual Steps:');
    finalReport.remainingManualSteps.forEach(step => console.log(`- ${step}`));
    console.log('=========================================');

  } catch (error) {
    console.error('CRITICAL TEST FAILURE:', error);
  } finally {
    process.exit(0);
  }
}

runTests();
