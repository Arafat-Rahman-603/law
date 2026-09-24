import { v2 as cloudinary } from 'cloudinary';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkServices() {
  // Test Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const res = await cloudinary.api.ping();
    console.log("CLOUDINARY_READY", res);
  } catch (e: any) {
    console.error("CLOUDINARY_ERROR:", e.message || e);
  }

  // Test Gemini
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_PROVIDER_1_KEY || '' });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_PROVIDER_1_MODEL || 'gemini-2.5-flash',
      contents: "hello",
    });
    console.log("GEMINI_READY", response.text?.substring(0, 10));
  } catch (e: any) {
    console.error("GEMINI_ERROR:", e.message);
  }
}

checkServices();
