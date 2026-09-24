import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config({ path: '.env.local' });

async function setupAdmin() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const db = mongoose.connection.db;
  
  const users = db?.collection('users');
  let admin = await users?.findOne({ role: 'ADMIN' });
  
  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await users?.insertOne({
      name: 'Pilot Admin',
      email: 'admin@axiomixs.com',
      password: hashedPassword,
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log("Created admin user: admin@axiomixs.com / admin123");
  } else {
    console.log("Admin user exists:", admin.email);
  }
  process.exit(0);
}
setupAdmin();
