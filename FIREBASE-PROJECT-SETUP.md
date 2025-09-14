# Firebase Project Configuration Guide

## 1. Firebase Project Creation via Web Console

### 1.1. Firebase Console Access

- Console URL: <https://console.firebase.google.com/>
- Authentication: Google account credentials required

### 1.2. Project Initialization Workflow

Project creation parameters:

1. Select "Add project" or "Create a project" interface
2. Project configuration:
   - Project name: "Angular Quiz 2025"
   - Project ID: angular-quiz-2025-abc123 (auto-generated)
   - Geographic location: Asia (asia-southeast1 - Singapore)

3. Google Analytics integration:
   - Initial configuration: "Disable" (can be enabled post-creation)

4. Execute "Create project" command
5. Allow 1-2 minutes for Firebase infrastructure provisioning

### 1.3. Required Service Activation

Post-project creation configuration:

**Cloud Functions Service Activation:**

```text
1. Navigation: Build → Functions
2. Initialize service via "Get started" interface
3. Blaze plan upgrade (if prompted):
   - Select "Modify plan" option
   - Choose "Blaze (Pay as you go)" tier
   - Configure billing account (credit card required, free tier available)
```

**Firestore Database Service Activation:**

```text
1. Navigation: Build → Firestore Database
2. Execute "Create database" workflow
3. Security rule configuration:
   - Development mode: "Start in test mode"
   - Geographic location: asia-southeast1 (Singapore)
4. Complete setup via "Done" confirmation
```

## 2. Local Project Firebase Integration

### 2.1. Terminal Configuration Commands

```bash
# List available Firebase projects
firebase projects:list

# Associate local project with Firebase project ID
firebase use YOUR_PROJECT_ID

# Alternative: Add project alias configuration
firebase use --add
# Select project from list → Enter alias name: "default"
```

### 2.2. Firebase Feature Initialization

```bash
firebase init

# Feature selection:
☑ Functions: Configure Cloud Functions directory structure
☑ Firestore: Configure security rules and index files
☑ Hosting: Configure Firebase Hosting deployment

# Functions configuration:
├── Programming language: JavaScript
├── ESLint integration: Disabled (simplified setup)
├── Install dependencies: Yes
└── Overwrite existing files: No

# Firestore configuration:
├── Rules file: firestore.rules (default)
└── Indexes file: firestore.indexes.json (default)

# Hosting configuration:
├── Public directory: dist/angular-quiz/browser
├── Single Page Application: Yes
└── GitHub integration: Manual setup (not automatic)
```

## 3. Configuration Verification

### 3.1. Project Structure Validation

```text
project-root/
├── functions/
│   ├── index.js
│   ├── package.json
│   └── node_modules/
├── firebase.json
├── .firebaserc
├── firestore.rules
└── firestore.indexes.json
```

### 3.2. Local Development Environment Testing

```bash
# Install Cloud Functions dependencies
cd functions
npm install

# Return to project root directory
cd ..

# Initialize Firebase emulator suite
firebase emulators:start --only functions,firestore

# Access Emulator UI via browser: http://localhost:4000
```

## 4. Test Deployment Process

### 4.1. Cloud Functions Deployment

```bash
firebase deploy --only functions
```

### 4.2. Firestore Security Rules Deployment

```bash
firebase deploy --only firestore:rules
```

### 4.3. Deployment Verification

- Functions endpoint: `https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/`
- Firestore console: Firebase Console → Firestore Database section

## Critical Implementation Considerations

### Billing and Resource Quotas

- **Spark Plan (No Cost)**: 125,000 function invocations/month, 1GB storage allocation
- **Blaze Plan (Pay-as-Use)**: Usage-based billing with generous free tier allocation
- **Cloud Functions External API Access**: Requires Blaze plan for outbound network requests

### Security Configuration

- **Test Mode Firestore**: Unrestricted read/write access (development environments only)
- **Production Security**: Mandatory authentication and granular security rules implementation

### Performance Characteristics

- **Cold Start Latency**: 1-3 seconds for initial function invocation
- **Warm Instance Response**: 100-500ms response time
- **Performance Optimization**: Implement scheduled function calls to maintain warm instances

---

**Implementation Note**: Bookmark Firebase Console project URL for efficient access to management interface.