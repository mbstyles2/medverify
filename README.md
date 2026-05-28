# MedVerify — Drug Authenticity Scanner & Anti-Counterfeiting Platform

MedVerify is a full-stack pharmaceutical compliance platform designed to secure drug delivery networks. It empowers regulators, pharmacies, suppliers, and consumers to verify the authenticity of medicine batches, detect photocopied cloned serial labels, check manufacturing expiry parameters, and upload feedback reports.

---

## 📁 Core Code Architecture Layout

```text
medverify/
├── server.ts            # Entry node server setup, JWT routers and static delivery
├── server/
│   ├── db.ts            # Sequelize + SQLite Schema layer with automatic pre-seeding
│   ├── auth.ts          # Core JWT registration/login & password hash controllers
│   └── routes.ts        # QR SCAN checks, medicine CRUD APIs, and Gemini support desk
├── src/
│   ├── App.tsx          # Master routing controller
│   ├── index.css        # Typography definitions and scan animations imports
│   ├── main.tsx         # Main mount
│   ├── types.ts         # Contracts definitions
│   ├── components/      
│   │   ├── Header.tsx   # Mobile-responsive navigation header
│   │   ├── Footer.tsx   # Elegant healthcare-trust footer
│   │   └── QrScannerComponent.tsx # Combined HTML5 webcam, fallback uploading, and manual typing codes
│   └── pages/
│       ├── LandingPage.tsx   # Marketing features presentations
│       ├── AboutPage.tsx     # compliance methodologies description
│       ├── ContactPage.tsx   # Support form handler
│       ├── AuthPage.tsx      # Registered portal login credentials
│       ├── ScannerPage.tsx   # Result timeline, visual diagnostics and Gemini integration
│       └── DashboardPage.tsx # Dynamic layout workspaces for Admins / Manufacturers
```

---

## 🚀 Speed Setup Instructions

This application is fully functional and preconfigured inside the sandbox out of the box. To run it locally or prepare a ZIP package, follow these straightforward guidelines:

### 1. Unified Run (Local Development Mode)
Simply trigger dynamic execution at the root of the workspace directory:
```bash
# 1. Install dependencies
npm install

# 2. Boot development server
npm run dev
```
The server will boot on **http://localhost:3000** automatically syncing the SQLite database state and seeding perfect dummy medicines and verification codes instantly.

### 2. Standalone Production Build
To bundle the frontend single-page-app assets alongside the compressed Express backend as requested:
```bash
# Build static client into dist/ and bundle server into server.cjs
npm run build

# Start the optimized production release
npm run start
```

---

## 🔍 Step-by-Step Test Scenarios

MedVerify comes preconfigured with four database-seeded scenario states to verify scanner capabilities immediately:

| Pre-Seeded Code | Associated Medication | Test Case Represented | Platform Defensive Behavior |
|:---|:---|:---|:---|
| `MV-AMX120-001` | **Amoxicillin Premium** | Genuine Standard Unit | Returns **GREEN** Genuine status checking, showing zero duplication counts. |
| `MV-LIP902-101` | **Lipitor Cardia** | Expired Product Unit | Returns **AMBER** Out-of-date cautionary status check recommending disposal. |
| `MV-PAR404-501` | **Paracetamol Rapid** | Cloned Label (Replay Attack) | Returns **RED** Suspicious Warning pointing out that the unit label was scanned 14 times previously! |
| `MV-FAKE-999-XYZ`| **Unregistered Box** | Counterfeit Code Entry | Returns **RED** Invalid Code notification advising immediate compliance reporting. |

### To Run a Scan:
1. Click **Scan Verification** inside the header.
2. Select **Live Camera** (allow device camera permission) OR click the **Manual Entry** tab.
3. Simply copy-paste any of the precompiled codes from the table above or click any of the **Interactive Demo Codes** displayed at the footer of the scanner module to instantly witness how our platform counters counterfeiting structures.

---

## 🤖 Gemini AI Safety Integration

MedVerify integrates natural language drug safety assistance using the **Google Gen AI SDK**. When verifying any genuine, suspicious, or expired item, click **Consult Gemini AI Advisor** inside the scanner sidecar panel. 

The application securely queries `gemini-3.5-flash` server-side to generate clear medical precautions, storage guidelines, and clinically structured safety indicators for the scanned medication. If API keys are unprovided, MedVerify's built-in sandbox advisor automatically falls back cleanly.

---

## 💾 Migrating to External MySQL Database

MedVerify uses **Sequelize ORM** which provides a database-independent connection abstraction layer. To convert the preconfigured local SQLite state to standard production **MySQL**:

1. Install the mysql driver locally:
   ```bash
   npm install mysql2
   ```

2. Replace the connection context in `/server/db.ts` with standard dialect credentials:
   ```typescript
   export const sequelize = new Sequelize('medverify_db', 'db_user', 'db_password', {
     host: 'localhost',
     dialect: 'mysql',
     logging: false,
   });
   ```

3. Configure your production environment database details inside `.env` variables accordingly.
