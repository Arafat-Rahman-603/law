import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI in your environment');
  process.exit(1);
}

// Minimal schemas for seeding
const countrySchema = new mongoose.Schema({
  code: String,
  name: String,
  defaultLanguage: String,
  supportedLanguages: [String],
  isActive: Boolean,
});

const Country = mongoose.models.Country || mongoose.model('Country', countrySchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB.');

    // Seed Countries
    const count = await Country.countDocuments();
    if (count === 0) {
      console.log('Seeding initial countries...');
      const countriesToInsert = [
        { code: 'BD', name: 'Bangladesh', defaultLanguage: 'bn', supportedLanguages: ['bn', 'en'], isActive: true },
        { code: 'ES', name: 'Spain', defaultLanguage: 'es', supportedLanguages: ['es', 'en'], isActive: true },
        { code: 'MX', name: 'Mexico', defaultLanguage: 'es', supportedLanguages: ['es', 'en'], isActive: true },
        { code: 'US', name: 'United States', defaultLanguage: 'en', supportedLanguages: ['en', 'es'], isActive: true }
      ];
      await Country.insertMany(countriesToInsert);
      console.log('Successfully seeded countries.');
    } else {
      console.log('Countries already exist in the database, skipping seed.');
    }

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seed();
