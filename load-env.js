// Environment Configuration Script
// This file loads environment variables from .env file
require('dotenv').config();

const fs = require('fs');
const path = require('path');

// Create environment configuration from .env file
const envConfig = `export const environment = {
  production: ${process.env.NODE_ENV === 'production'},
  firebase: {
    apiKey: "${process.env.NG_APP_FIREBASE_API_KEY || ''}",
    authDomain: "${process.env.NG_APP_FIREBASE_AUTH_DOMAIN || ''}",
    projectId: "${process.env.NG_APP_FIREBASE_PROJECT_ID || ''}",
    storageBucket: "${process.env.NG_APP_FIREBASE_STORAGE_BUCKET || ''}",
    messagingSenderId: "${process.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID || ''}",
    appId: "${process.env.NG_APP_FIREBASE_APP_ID || ''}",
    measurementId: "${process.env.NG_APP_FIREBASE_MEASUREMENT_ID || ''}"
  }
};`;

// Write to environment files
const envPath = path.join(__dirname, 'src', 'environments', 'environment.ts');
const envProdPath = path.join(__dirname, 'src', 'environments', 'environment.prod.ts');

fs.writeFileSync(envPath, envConfig);
fs.writeFileSync(envProdPath, envConfig.replace('production: false', 'production: true'));

console.log('✅ Environment variables loaded from .env file');