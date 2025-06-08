import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { toNodeHandler } from 'better-auth/node';
import { initializeDatabase } from './config/database';
import { config } from './config/app';
import { auth } from './auth';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error';
import getHeaders from './utils/getHeaders';

async function bootstrap() {
  // Initialize database
  await initializeDatabase();
  const authHandler = toNodeHandler(auth);

  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({
    ...config.cors,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
    exposedHeaders: ['set-cookie'],
  }));

  // Body parsing middleware
 
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Trust proxy for accurate IP addresses
  app.set('trust proxy', 1);

  if (config.nodeEnv === 'development') {
    app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
      console.log('Headers:', req.headers);
      if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', req.body);
      }
      next();
    });
  }

  console.log('🔧 Testing BetterAuth configuration...');
  try {
    await auth.api.getSession({
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });
    console.log('✅ BetterAuth configuration is valid');
  } catch (error) {
    console.error('❌ BetterAuth configuration error:', error);
  }

  // Manual test route for debugging
  app.post('/api/test-signup', async (req, res) => {
    console.log('🧪 Testing manual signup...');
    console.log('Request body:', req.body);
    
    try {
      const result = await auth.api.signUpEmail({
        body: req.body,
        headers: getHeaders(req.headers),
      });
      
      console.log('✅ Manual signup successful:', result);
      res.json(result);
    } catch (error) {
      console.error('❌ Manual signup error:', error);
      res.status(500).json({ 
        error: error.message,
        stack: error.stack 
      });
    }
  });

  
  // BetterAuth handler with additional debugging
  app.all('/api/auth/*splat', (req, res) => {
    console.log(`🔐 BetterAuth handling: ${req.method} ${req.url}`);
    console.log('🔐 Request body:', req.body);

    authHandler(req, res).catch(err => {
      console.error('BetterAuth handler error:', err);
      res.status(500).json({ error: 'Internal auth error' });
    });
  });
  

  // API routes
  app.use('/api', express.json(), routes);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  // Start server
  app.listen(config.port, () => {
    console.log(`🚀 Server running on http://localhost:${config.port}`);
    console.log(`📚 API Documentation: http://localhost:${config.port}/api/health`);
    console.log(`🔐 Auth endpoints: http://localhost:${config.port}/api/auth/*`);
    console.log(`🔧 Environment: ${config.nodeEnv}`);
  });
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});