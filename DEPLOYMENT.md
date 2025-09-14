# Deployment Guide

## Overview
This Angular Quiz application uses Firebase as the backend and GitHub Pages for frontend deployment.

## Prerequisites
- Node.js (18 or higher)
- Firebase account
- GitHub account
- Git installed locally

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "angular-quiz-app")
4. Enable Google Analytics (optional)
5. Wait for project creation

### 2. Setup Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select your preferred region
5. Click "Done"

### 3. Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web app" icon (</>) 
4. Register your app with a name
5. Copy the Firebase configuration object

### 4. Configure Environment Files

Update `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  firebase: {
    projectId: 'your-project-id',
    appId: 'your-app-id',
    storageBucket: 'your-project-id.appspot.com',
    locationId: 'your-region',
    apiKey: 'your-api-key',
    authDomain: 'your-project-id.firebaseapp.com',
    messagingSenderId: 'your-sender-id',
    measurementId: 'your-measurement-id',
  }
};
```

Update `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  firebase: {
    // Same configuration as above
  }
};
```

## GitHub Pages Deployment

### 1. Create GitHub Repository
1. Create new repository on GitHub
2. Clone it locally or add remote to existing project:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/angular-quiz.git
   ```

### 2. Deploy to GitHub Pages
```bash
# Build and deploy in one command
npm run deploy:github

# Or step by step:
npm run build:prod
npm run deploy
```

### 3. Configure GitHub Pages
1. Go to your repository on GitHub
2. Settings → Pages
3. Source: "Deploy from a branch"
4. Branch: "gh-pages"
5. Folder: "/ (root)"
6. Save

Your app will be available at: `https://YOUR_USERNAME.github.io/REPOSITORY_NAME/`

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Run Tests
```bash
npm test
```

## Production Considerations

### Firebase Security Rules
Update Firestore security rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to questions
    match /questions/{document} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can write
    }
    
    // Allow write access to quiz results
    match /quiz-results/{document} {
      allow read, write: if true; // Adjust based on your needs
    }
  }
}
```

### Environment Variables
For CI/CD, use GitHub Secrets:
1. Repository Settings → Secrets and variables → Actions
2. Add secrets for Firebase configuration
3. Use in GitHub Actions workflow

## Troubleshooting

### Common Issues

1. **404 on GitHub Pages**: Ensure `base-href` is set correctly in build command
2. **Firebase Connection Issues**: Check API keys and project configuration
3. **Build Errors**: Verify Angular CLI version and dependencies

### Debug Commands
```bash
# Check Angular version
ng version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check Firebase connection
npm run start
# Open browser console and check for Firebase errors
```

## Support
For issues related to:
- Angular: [Angular Documentation](https://angular.io/docs)
- Firebase: [Firebase Documentation](https://firebase.google.com/docs)
- GitHub Pages: [GitHub Pages Documentation](https://docs.github.com/en/pages)