# Firebase Backend Deployment Checklist

## 1. Development Environment Setup

### Node.js Runtime Environment
```bash
# Verify runtime version compatibility (Firebase Functions requires Node.js 18+)
node --version  # v18.x.x or higher required
npm --version   # 9.x.x or higher required

# Install from official distribution: https://nodejs.org/
```

### Firebase CLI Installation
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Verify installation
firebase --version  # 13.x.x or higher required

# Authentication with Google Cloud
firebase login
# Opens browser authentication flow for Google account
```

## 2. Firebase Project Configuration

### Project Creation Process

1. Access Firebase Console: <https://console.firebase.google.com/>
2. Initialize new project via "Create a project" interface
3. Project identifier: `angular-quiz-backend`
4. Disable Google Analytics integration (not required for backend services)
5. Complete project creation workflow

### Service Activation Requirements

Firebase Console service activation:

```
Firebase Console Navigation:
├── Cloud Functions: Build → Functions → Initialize service
├── Firestore Database: Build → Firestore Database → Create database
│   └── Security Mode: "Test mode" (development) or "Production mode"
├── Authentication: Build → Authentication → Enable service
└── Billing Configuration: Settings → Usage and billing → Upgrade plan (if required)
```

**Critical Billing Considerations:**

- **Spark Plan (No Cost)**: 125,000 function invocations per month limit
- **Blaze Plan (Pay-as-Use)**: Required for production environments, includes free tier allocation

## 3. Project Structure Standards

### Firebase Backend Directory Architecture

```text
project-root/
├── functions/              # Cloud Functions backend implementation
│   ├── src/               # TypeScript source code (if using TypeScript)
│   ├── lib/               # Compiled JavaScript output (auto-generated)
│   ├── index.js           # Main application entry point
│   ├── package.json       # NPM dependencies and scripts
│   └── .env               # Local environment variables (excluded from version control)
├── firestore.rules        # Database security rules configuration
├── firestore.indexes.json # Database index definitions
├── firebase.json          # Firebase project configuration
├── .firebaserc            # Project deployment settings
└── .env                   # Global environment variables
```

## 4. Authentication and Authorization Configuration

### Service Account Key Generation (CI/CD Pipeline)

Service account creation process:

1. Navigate to Google Cloud Console → IAM & Admin → Service Accounts
2. Create Service Account configuration:
   - Account Name: "firebase-deploy"
   - Required IAM Roles:
     - Firebase Admin
     - Cloud Functions Admin
     - Firestore Admin
3. Generate JSON key file via Create Key → JSON format
4. Securely store JSON credentials (exclude from version control systems)

## 5. Dependency Management

### Cloud Functions Package Configuration

```json
{
  "engines": {
    "node": "18"
  },
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^4.5.0",
    "express": "^4.18.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "typescript": "^5.0.0"
  }
}
```

## 6. Network Security and Access Control

### Firestore Database Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Development environment - unrestricted access
    match /{document=**} {
      allow read, write: if true; // WARNING: Development only
    }
    
    // Production security rules (recommended implementation)
    match /questions/{questionId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Cross-Origin Resource Sharing (CORS) Configuration

```javascript
// functions/index.js
const cors = require('cors');

app.use(cors({
  origin: [
    'https://yourusername.github.io',  // Production domain
    'http://localhost:4200',           // Development server
    'http://localhost:3000'            // Alternative development port
  ],
  credentials: true
}));
```

## 7. Common Issue Resolution

### Authentication Errors

```bash
firebase login --reauth
```

### Project Configuration Issues

```bash
firebase projects:list
firebase use your-project-id
```

### Billing Plan Requirements

```bash
# Upgrade to Blaze plan via Firebase Console
# Navigation: Settings → Usage and billing → Modify plan
```

### Cross-Origin Resource Sharing Errors

```bash
# Verify allowed origins in functions source code
# Redeploy functions after configuration changes
firebase deploy --only functions
```

## 8. Monitoring and Debugging Tools

### Development Environment

```bash
# Local Firebase emulator suite
firebase emulators:start --only functions,firestore

# Function log monitoring
firebase functions:log --only functionName

# Enhanced debugging with line limit
firebase functions:log --only functionName --lines 50
```

### Production Environment

```bash
# Production log monitoring
firebase functions:log

# Performance metrics available in Firebase Console
# Navigation: Functions → Usage tab for detailed analytics
```

---

**Deployment readiness achieved upon completion of this technical checklist.**