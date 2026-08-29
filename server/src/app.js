import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import gmailRoutes from './routes/gmail.routes.js';
import emailRoutes from './routes/email.routes.js';
import aiRoutes from './routes/ai.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import { getDBStatus } from './config/db.js';

dotenv.config();

const app = express();

// Security and utility middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'Intelligent Email Assistant Backend API',
    version: '1.0.0',
    status: 'running',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    apiRoot: '/api',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      gmail: '/api/gmail',
      emails: '/api/emails',
      ai: '/api/ai',
      analytics: '/api/analytics'
    },
    message: 'Backend server is running! Open the frontend web app at http://localhost:5173'
  });
});

// API Root discovery endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    service: 'Intelligent Email Assistant API',
    version: '1.0.0',
    status: 'running',
    database: getDBStatus(),
    endpoints: {
      health: 'GET /api/health',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        profile: 'GET /api/auth/me',
        logout: 'POST /api/auth/logout'
      },
      gmail: {
        connect: 'GET /api/gmail/connect',
        status: 'GET /api/gmail/status',
        simulate: 'POST /api/gmail/simulate-connect',
        disconnect: 'POST /api/gmail/disconnect'
      },
      emails: {
        list: 'GET /api/emails',
        get: 'GET /api/emails/:id',
        send: 'POST /api/emails/send',
        draft: 'POST /api/emails/draft',
        toggleRead: 'PATCH /api/emails/:id/read',
        toggleStar: 'PATCH /api/emails/:id/star',
        archive: 'PATCH /api/emails/:id/archive',
        delete: 'DELETE /api/emails/:id'
      },
      ai: {
        summarize: 'POST /api/ai/summarize',
        reply: 'POST /api/ai/reply',
        classify: 'POST /api/ai/classify',
        actionItems: 'POST /api/ai/action-items',
        explain: 'POST /api/ai/explain',
        rewrite: 'POST /api/ai/rewrite'
      },
      analytics: {
        dashboard: 'GET /api/analytics/dashboard'
      }
    },
    clientApp: 'http://localhost:5173'
  });
});

// Health check and root ping
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Intelligent Email Assistant API',
    version: '1.0.0',
    database: getDBStatus()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/gmail', gmailRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
});

// 404 Route Catch-all
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on this server`
  });
});

export default app;
