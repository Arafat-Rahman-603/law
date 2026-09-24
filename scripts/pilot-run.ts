import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LegalSource from '../src/models/LegalSource';
import Law from '../src/models/Law';
import LawVersion from '../src/models/LawVersion';
import Country from '../src/models/Country';
import Jurisdiction from '../src/models/Jurisdiction';
import LegalCategory from '../src/models/LegalCategory';

dotenv.config({ path: '.env.local' });

async function runPilot() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("Connected to MongoDB for Pilot Test");

  const adminUser = await mongoose.connection.db.collection('users').findOne({ email: 'admin@axiomixs.com' });
  if (!adminUser) throw new Error("Admin user not found");

  // 1. Ensure Country and Jurisdiction exist
  let bd = await Country.findOne({ code: 'BD' });
  if (!bd) {
    bd = await Country.create({ code: 'BD', name: 'Bangladesh', active: true });
  }

  let dhaka = await Jurisdiction.findOne({ slug: 'dhaka' });
  if (!dhaka) {
    dhaka = await Jurisdiction.create({ country: bd._id, name: 'Dhaka', slug: 'dhaka', level: 'STATE' });
  }

  // 2. Add ONE real authoritative legal source
  const source = await LegalSource.create({
    name: 'Ministry of Law, Justice and Parliamentary Affairs (BD)',
    authorityName: 'Government of Bangladesh',
    sourceType: 'OFFICIAL_GAZETTE',
    country: bd._id,
    officialDomain: 'minlaw.gov.bd',
    baseUrl: 'http://bdlaws.minlaw.gov.bd/',
    sourceUrl: 'http://bdlaws.minlaw.gov.bd/act-1033.html',
    verificationStatus: 'UNDER_REVIEW'
  });

  // 3. Source Verification
  console.log("Verifying Legal Source...");
  source.verificationStatus = 'SOURCE_VERIFIED';
  source.approvedBy = adminUser._id;
  source.approvedAt = new Date();
  await source.save();

  // Audit Log for Source
  await mongoose.connection.db.collection('auditlogs').insertOne({
    action: 'SOURCE_VERIFIED',
    actor: adminUser._id,
    target: source._id,
    targetModel: 'LegalSource',
    timestamp: new Date(),
    metadata: { status: 'VERIFIED' }
  });
  console.log("Source Verified:", source.name);

  // 4. Ensure Category exists
  let laborCategory = await LegalCategory.findOne({ slug: 'labor-law' });
  if (!laborCategory) {
    laborCategory = await LegalCategory.create({
      name: 'Labor Law',
      slug: 'labor-law',
      description: 'Laws relating to labor and employment.'
    });
  }

  // 5. Import ONE real legal record (DRAFT)
  console.log("Importing Law Record: Bangladesh Labour Act, 2006 - Section 26");
  
  const law = await Law.create({
    title: 'Bangladesh Labour Act, 2006 - Section 26: Termination of employment by employer otherwise than by dismissal',
    slug: 'bd-labour-act-2006-sec-26',
    legalIdentifier: 'ACT_NO_XLII_OF_2006_SEC_26',
    country: bd._id,
    jurisdiction: dhaka._id, // Applicable in Dhaka
    category: laborCategory._id,
    summary: 'Rules for termination of a permanent worker by the employer without dismissal.',
    officialText: 'Where an employer desires to terminate the employment of a permanent worker, he shall give him one hundred and twenty days notice in writing in the case of a monthly rated worker, and sixty days notice in writing in the case of other workers, or wages in lieu thereof.',
    source: source._id,
    status: 'Active',
    verificationStatus: 'DRAFT', // Starts as draft
  });

  console.log("Law Draft Created:", law.legalIdentifier);

  // 6. Legal Review (DRAFT -> SUBMITTED -> UNDER_REVIEW -> SOURCE_VERIFIED -> LEGAL_REVIEWED -> APPROVED -> PUBLISHED)
  const states = ['SUBMITTED', 'UNDER_REVIEW', 'SOURCE_VERIFIED', 'LEGAL_REVIEWED', 'APPROVED', 'PUBLISHED'];
  
  for (const state of states) {
    law.verificationStatus = state as any;
    if (state === 'PUBLISHED') {
      law.lastVerifiedAt = new Date();
      law.verifiedBy = adminUser._id;
    }
    await law.save();
    
    // Audit log
    await mongoose.connection.db.collection('auditlogs').insertOne({
      action: `LAW_${state}`,
      actor: adminUser._id,
      target: law._id,
      targetModel: 'Law',
      timestamp: new Date()
    });
    console.log(`Transitioned to: ${state}`);
  }

  console.log("Law successfully published and audit logs generated!");

  // Wait for Atlas Search Sync (Simulated wait)
  console.log("Simulating Atlas Search Index Sync Wait...");
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("PILOT DATA PREPARATION COMPLETE");
  process.exit(0);
}

runPilot();
