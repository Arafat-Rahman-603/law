import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkMongoDB() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI missing");

    await mongoose.connect(uri);
    console.log("MONGODB_CONNECTED");
    
    const db = mongoose.connection.db;
    if (!db) throw new Error("No db connection");
    console.log("DB_NAME:", db.databaseName);
    
    // Check Atlas search by doing a dummy $search on LegalSource
    try {
      const result = await db.collection('legalsources').aggregate([
        {
          $search: {
            index: "default",
            text: {
              query: "test",
              path: "name"
            }
          }
        },
        { $limit: 1 }
      ]).toArray();
      console.log("ATLAS_SEARCH: READY");
    } catch (e: any) {
      console.error("ATLAS_SEARCH_ERROR:", e.message);
      console.log("ATLAS_SEARCH: NOT_READY");
    }

    process.exit(0);
  } catch (e: any) {
    console.error("MONGODB_CONNECTION_ERROR:", e.message);
    process.exit(1);
  }
}

checkMongoDB();
