import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import * as path from 'path';
import * as fs from 'fs';
import bcrypt from 'bcryptjs';

const dbPath = path.join(process.cwd(), 'medverify.sqlite');

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

// Models definitions
export class UserInstance extends Model {}
UserInstance.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('Admin', 'Consumer', 'Pharmacy', 'Manufacturer'), defaultValue: 'Consumer' },
    details: { type: DataTypes.TEXT, allowNull: true }, // Store License/Reg info as JSON string stringified
  },
  { sequelize, modelName: 'User' }
);

export class MedicineInstance extends Model {}
MedicineInstance.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    manufacturer: { type: DataTypes.STRING, allowNull: false },
    dosage: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, modelName: 'Medicine' }
);

export class BatchInstance extends Model {}
BatchInstance.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    batchNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
    mfgDate: { type: DataTypes.DATEONLY, allowNull: false },
    expDate: { type: DataTypes.DATEONLY, allowNull: false },
  },
  { sequelize, modelName: 'Batch' }
);

export class SerialCodeInstance extends Model {}
SerialCodeInstance.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true, allowNull: false },
    scanCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.ENUM('Active', 'Recalled', 'Suspicious'), defaultValue: 'Active' },
  },
  { sequelize, modelName: 'SerialCode' }
);

export class ScanLogInstance extends Model {}
ScanLogInstance.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    location: { type: DataTypes.STRING, allowNull: false },
    result: { type: DataTypes.STRING, allowNull: false },
    ipAddress: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: 'ScanLog' }
);

export class ReportInstance extends Model {}
ReportInstance.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    comments: { type: DataTypes.TEXT, allowNull: false },
    photoUrl: { type: DataTypes.TEXT, allowNull: true }, // Store Base64 for ease of upload
    status: { type: DataTypes.ENUM('Pending', 'Investigating', 'Resolved'), defaultValue: 'Pending' },
    medicineName: { type: DataTypes.STRING, allowNull: true },
    batchNumber: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: 'Report' }
);

// Relationships
MedicineInstance.hasMany(BatchInstance, { foreignKey: 'MedicineId', onDelete: 'CASCADE' });
BatchInstance.belongsTo(MedicineInstance, { foreignKey: 'MedicineId' });

BatchInstance.hasMany(SerialCodeInstance, { foreignKey: 'BatchId', onDelete: 'CASCADE' });
SerialCodeInstance.belongsTo(BatchInstance, { foreignKey: 'BatchId' });

UserInstance.hasMany(ScanLogInstance, { foreignKey: 'UserId', onDelete: 'SET NULL' });
ScanLogInstance.belongsTo(UserInstance, { foreignKey: 'UserId' });

SerialCodeInstance.hasMany(ScanLogInstance, { foreignKey: 'SerialCodeId', onDelete: 'CASCADE' });
ScanLogInstance.belongsTo(SerialCodeInstance, { foreignKey: 'SerialCodeId' });

UserInstance.hasMany(ReportInstance, { foreignKey: 'UserId', onDelete: 'SET NULL' });
ReportInstance.belongsTo(UserInstance, { foreignKey: 'UserId' });

export async function initializeDatabase() {
  await sequelize.sync({ force: false }); // Auto migrate structure
  console.log('Database synced successfully');

  // Let's seed initial data if table is empty
  const userCount = await UserInstance.count();
  if (userCount === 0) {
    console.log('Database empty, seeding default data...');
    // Seed Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const adminUser = await UserInstance.create({
      name: 'System Administrator',
      email: 'admin@medverify.com',
      password: hashedPassword,
      role: 'Admin',
      details: JSON.stringify({ department: 'Compliance' })
    });

    const consumerUser = await UserInstance.create({
      name: 'John Consumer',
      email: 'consumer@medverify.com',
      password: hashedPassword,
      role: 'Consumer',
      details: JSON.stringify({ phone: '+123456789' })
    });

    const pharmacyUser = await UserInstance.create({
      name: 'City Care Pharmacy',
      email: 'pharmacy@medverify.com',
      password: hashedPassword,
      role: 'Pharmacy',
      details: JSON.stringify({ licenseNumber: 'PH-9821-A', address: '492 Medical Way, NY' })
    });

    const manufacturerUser = await UserInstance.create({
      name: 'BioPharma Global',
      email: 'manufacturer@medverify.com',
      password: hashedPassword,
      role: 'Manufacturer',
      details: JSON.stringify({ regNumber: 'MFG-2019-88', contact: 'Dr. Sarah Carter' })
    });

    // Seed Medicines
    const m1 = await MedicineInstance.create({
      name: 'Amoxicillin Premium',
      manufacturer: 'BioPharma Global',
      dosage: '500mg Capsule',
      description: 'Broad-spectrum antibiotic used to treat bacterial infections.',
    });

    const m2 = await MedicineInstance.create({
      name: 'Lipitor Cardia',
      manufacturer: 'Pfizer Labs',
      dosage: '20mg Tablet',
      description: 'Statin medication used to prevent cardiovascular disease and lower lipids.',
    });

    const m3 = await MedicineInstance.create({
      name: 'Paracetamol Rapid',
      manufacturer: 'MedHealth Corp',
      dosage: '650mg Caplets',
      description: 'Common medication used for fever reduction and mild-to-moderate pain relief.',
    });

    // Seed Batches
    // Batch 1: Genuine and Active
    const b1 = await BatchInstance.create({
      batchNumber: 'AMX-120',
      mfgDate: '2026-01-10',
      expDate: '2028-11-20',
      MedicineId: m1.get('id') as number,
    });

    // Batch 2: Expired Batch
    const b2 = await BatchInstance.create({
      batchNumber: 'LIP-902',
      mfgDate: '2024-03-01',
      expDate: '2025-05-15', // Past expiry (current calendar date 2026-05-28)
      MedicineId: m2.get('id') as number,
    });

    // Batch 3: Counterfeit duplication case (Pre-scanned lots of times)
    const b3 = await BatchInstance.create({
      batchNumber: 'PAR-404',
      mfgDate: '2025-06-01',
      expDate: '2027-10-10',
      MedicineId: m3.get('id') as number,
    });

    // Seed Serial Codes
    // Active Genuine Codes (Scan Count starts at 0)
    await SerialCodeInstance.create({
      code: 'MV-AMX120-001',
      scanCount: 0,
      status: 'Active',
      BatchId: b1.get('id') as number,
    });
    await SerialCodeInstance.create({
      code: 'MV-AMX120-002',
      scanCount: 0,
      status: 'Active',
      BatchId: b1.get('id') as number,
    });

    // Expired codes
    await SerialCodeInstance.create({
      code: 'MV-LIP902-101',
      scanCount: 0,
      status: 'Active',
      BatchId: b2.get('id') as number,
    });
    await SerialCodeInstance.create({
      code: 'MV-LIP902-102',
      scanCount: 0,
      status: 'Active',
      BatchId: b2.get('id') as number,
    });

    // Code that has expired, wait, already scanned / cloned code
    await SerialCodeInstance.create({
      code: 'MV-PAR404-501',
      scanCount: 14, // Trigger Suspicious cloning detection
      status: 'Active',
      BatchId: b3.get('id') as number,
    });
    // Active test code for PAR-404
    await SerialCodeInstance.create({
      code: 'MV-PAR404-502',
      scanCount: 0,
      status: 'Active',
      BatchId: b3.get('id') as number,
    });

    // Preseed mock reports
    await ReportInstance.create({
      title: 'Suspicious packaging on Paracetamol Rapid',
      comments: 'The QR code was slightly smudged and has printed errors on the label under Batch PAR-404. Scanned duplicate alerts appeared.',
      status: 'Pending',
      UserId: consumerUser.get('id') as number,
      medicineName: 'Paracetamol Rapid',
      batchNumber: 'PAR-404',
    });

    console.log('Seed data successfully loaded');
  }
}
