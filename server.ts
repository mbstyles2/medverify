import express from 'express';
import * as path from 'path';
import { createServer as createViteServer } from 'vite';
import { initializeDatabase } from './server/db';
import { authController, authenticateToken, requireRole } from './server/auth';
import { routesController } from './server/routes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: '10mb' })); // Support base64 image uploads easily

  // Initialize SQLite & Seed default database values
  try {
    await initializeDatabase();
    console.log('MedVerify Database connected & initialized.');
  } catch (err) {
    console.error('Database connection failed on startup:', err);
  }

  // --- API ROUTING ENDPOINTS ---

  // Auth Group
  app.post('/api/auth/register', authController.register);
  app.post('/api/auth/login', authController.login);
  app.get('/api/auth/me', authenticateToken, authController.me);

  // Scanner Verification Endpoints (Support optional token for scanning logs tracking)
  app.post('/api/scan/verify', (req, res, next) => {
    // If authorization header exists, authenticate token, otherwise proceed as Guest User
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.split(' ')[1]) {
      authenticateToken(req as any, res, next);
    } else {
      next(); // Guest Scan
    }
  }, routesController.verifyCode);

  // Medicines Management CRUD Group
  app.get('/api/medicines', routesController.getMedicines);
  app.post('/api/medicines', authenticateToken, requireRole(['Admin', 'Manufacturer']), routesController.createMedicine);
  app.put('/api/medicines/:id', authenticateToken, requireRole(['Admin', 'Manufacturer']), routesController.updateMedicine);
  app.delete('/api/medicines/:id', authenticateToken, requireRole(['Admin', 'Manufacturer']), routesController.deleteMedicine);

  // Batches Group
  app.get('/api/batches', routesController.getBatches);
  app.post('/api/batches', authenticateToken, requireRole(['Admin', 'Manufacturer']), routesController.createBatch);
  app.get('/api/batches/:batchId/codes', authenticateToken, routesController.getBatchCodes);

  // Reports Group (Consumers/Pharmacies submit, Admin resolves)
  app.get('/api/reports', routesController.getReports);
  app.post('/api/reports', authenticateToken, routesController.createReport);
  app.put('/api/reports/:id', authenticateToken, requireRole(['Admin']), routesController.updateReportStatus);

  // Admin and Manufacturer Analytics Stats Metrics
  app.get('/api/dashboard/stats', authenticateToken, requireRole(['Admin', 'Manufacturer', 'Pharmacy']), routesController.getDashboardStats);

  // Gemini AI Supportive Safety advisory
  app.post('/api/gemini/explain', routesController.askGeminiSafetyInstructions);

  // Static files or Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Running Vite in Middleware mode (Development)');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving built client files from dist (Production)');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MedVerify server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
