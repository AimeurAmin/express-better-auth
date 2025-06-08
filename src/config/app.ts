export const config = {
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  jwtExpiresIn: process.env.JWT_EXPIRATION || '7d',
  betterAuth: {
    secret: process.env.BETTER_AUTH_SECRET || 'fallback-secret',
    url: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  },
  cors: {
    origin: (process.env.BETTER_AUTH_TRUSTED_ORIGINS || '').split(','),
    credentials: true,
  },
};