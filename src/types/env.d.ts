/**
 * Environment Variables Type Definitions
 *
 * This file provides TypeScript type safety for environment variables.
 * All required environment variables must be defined here.
 */

declare namespace NodeJS {
  interface ProcessEnv {
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;

    // Google AI (Gemini)
    GOOGLE_AI_API_KEY: string;

    // App
    NEXT_PUBLIC_APP_URL: string;

    // Node.js
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
