import { betterAuth } from 'better-auth';
import { createPool } from 'mysql2/promise';
import { config } from './config/app';
import { sendEmail } from './utils/sendEmail';

// Create MySQL connection pool
const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'express_auth_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL pool connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ MySQL pool connection failed:', err);
  });

console.log('🔧 BetterAuth configuration:');
console.log('- Secret length:', config.betterAuth.secret.length);
console.log('- Base URL:', config.betterAuth.url);
console.log('- Trusted origins:', config.cors.origin);

export const auth = betterAuth({
  database: pool,
  logger: {
    level: 'debug',
    disabled: false, // Always enable logging for debugging
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 6, // Lowered from default 8
    sendResetPassword: async ({ user, url, token }, request) => {
      const frontendResetUrl = 'http://localhost:5173/reset-password';
      const resetUrl = new URL(url);
      resetUrl.searchParams.set('callbackURL', frontendResetUrl);
      await sendEmail({
        to: user.email,
        subject: 'Reset your password',
        text: `Click the link to reset your password: ${resetUrl.toString()}`,
      });
    },
    sendVerificationEmail: true,
    signUp: {
      autoSignIn: true,
      sendVerificationEmail: true,
    }
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // Your desired frontend redirect URL after verification
      const frontendRedirect = 'http://localhost:5173/email-verified';

      // Use URL API to parse and manipulate the verification URL
      const verificationUrl = new URL(url);

      // Replace or set the existing callbackURL param to your frontend URL
      verificationUrl.searchParams.set('callbackURL', frontendRedirect);

      await sendEmail({
        to: user.email,
        subject: 'Verify your email address',
        text: `Click the link to verify your email: ${verificationUrl.toString()}`,
      });
    },
    
    onEmailVerification: async (user, request) => {
      console.log(`Email verified for user: ${user.id}`);
    },
    sendOnSignUp: true,
  },
  user: {
    changeEmail: {
      enabled: false,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  secret: config.betterAuth.secret,
  baseURL: config.betterAuth.url,
  trustedOrigins: config.cors.origin,
  advanced: {
    useSecureCookies: false, // Disable for local development
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;