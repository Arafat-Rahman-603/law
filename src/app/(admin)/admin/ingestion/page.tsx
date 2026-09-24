import { Metadata } from 'next';
import dbConnect from '@/lib/db';
import LegalSource from '@/models/LegalSource';
import IngestionJob from '@/models/IngestionJob';
import IngestionClient from './IngestionClient';
import { VerificationStatus } from '@/models/LegalSource';

export const metadata: Metadata = {
  title: 'Ingestion Dashboard | Axiomixs Law',
};

export const dynamic = 'force-dynamic';

export default async function IngestionPage() {
  await dbConnect();

  // Get all verified sources
  const sources = await LegalSource.find({
    $or: [
      { verificationStatus: VerificationStatus.SOURCE_VERIFIED },
      { verificationStatus: VerificationStatus.PUBLISHED }
    ]
  }).lean();

  // Get recent ingestion jobs
  const jobs = await IngestionJob.find({})
    .populate('source', 'name officialDomain')
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  // Map sources to POJOs for the client
  const serializedSources = sources.map(s => ({
    id: s._id.toString(),
    name: s.name,
    officialDomain: s.officialDomain,
    status: s.status,
    verificationStatus: s.verificationStatus,
    lastCheckedAt: s.lastCheckedAt?.toISOString() || null,
    lastSuccessfulFetchAt: s.lastSuccessfulFetchAt?.toISOString() || null,
    lastChangedAt: s.lastChangedAt?.toISOString() || null,
  }));

  const serializedJobs = jobs.map(j => ({
    id: j._id.toString(),
    sourceName: (j.source as any)?.name || 'Unknown Source',
    status: j.status,
    startedAt: j.startedAt.toISOString(),
    completedAt: j.completedAt?.toISOString() || null,
    recordsDiscovered: j.recordsDiscovered,
    draftsCreated: j.draftsCreated,
    parserVersion: j.parserVersion,
    errorMessage: j.errorMessage,
  }));

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Source Ingestion Engine</h1>
        <p className="text-gray-600">
          Monitor and manage automated data ingestion from verified official sources.
        </p>
      </div>

      <IngestionClient initialSources={serializedSources} initialJobs={serializedJobs} />
    </div>
  );
}
