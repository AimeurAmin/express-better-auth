# Express BetterAuth API

A modern Express.js v5 API with TypeScript, TypeORM, MySQL, and BetterAuth for authentication.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [API Endpoints](#api-endpoints)
  - [Authentication (handled by BetterAuth)](#authentication-handled-by-betterauth)
  - [Custom API Routes](#custom-api-routes)
- [Future Features](#future-features)

## Features

- **Express v5** - Latest version of Express.js
- **TypeScript** - Full type safety
- **BetterAuth** - Modern authentication library
- **TypeORM** - Database ORM with MySQL support
- **Validation** - Request validation middleware
- **Error Handling** - Centralized error handling
- **Security** - Helmet, CORS, and other security measures

## Project Structure

```
src/
├── config/          # Configuration files
│   ├── app.ts       # App configuration
│   └── database.ts  # Database configuration
├── controllers/     # Request handlers
│   ├── auth.controller.ts
│   └── user.controller.ts
├── middlewares/     # Custom middlewares
│   ├── auth.ts      # Authentication middleware
│   ├── error.ts     # Error handling middleware
│   └── validation.ts # Request validation
├── models/          # Database entities
│   ├── User.ts
|   └── Session.ts
├── routes/          # Route definitions
│   ├── auth.ts
│   ├── users.ts
│   └── index.ts
├── services/        # Business logic
│   └── userService.ts
├── main.ts         # Application entry point
└── auth.ts         # BetterAuth configuration
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create MySQL database:**
   ```sql
   CREATE DATABASE express_auth_db;
   ```

3. **Configure environment variables:**
   Copy `.env` and update the values:
   ```bash
   cp .env .env.local
   ```

4. **Set up database schema**:
   **Using BetterAuth CLI:**
   ```bash
   npm run auth:generate 
   npm run auth:migrate
   ```

5. **Run in development:**
   ```bash
   npm run dev
   ```

6. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Authentication (handled by BetterAuth)

- `POST /api/auth/sign-up/email` - Register with email/password
- `POST /api/auth/sign-in/email` - Login with email/password  
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Get current session

### Custom API Routes

- `GET /api/health` - Health check
- `GET /api/auth/me` - Get current user (requires auth)
- `GET /api/users/profile` - Get user profile (requires auth)
- `PUT /api/users/profile` - Update user profile (requires auth)

## Future Features

This project is designed to be extensible with additional authentication providers. Planned features include:

- **Google OAuth** - Sign in with Google accounts
- **GitHub OAuth** - Authentication via GitHub
- **Facebook OAuth** - Social login with Facebook
- **LinkedIn OAuth** - Professional networking authentication

All of these OAuth providers are natively supported by BetterAuth, making integration straightforward when needed. The modular architecture allows for easy addition of new authentication methods without disrupting existing functionality.