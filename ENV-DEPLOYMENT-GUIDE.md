# Environment Variables Setup for Webapp Branch Deployment

This guide explains how to securely handle environment variables when deploying to the `webapp` branch using GitHub Actions.

## 🔐 Method 1: GitHub Secrets (Recommended)

### Step 1: Set Up GitHub Repository Secrets

1. Go to your GitHub repository: `https://github.com/trieuquochung/angular-quiz`
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** and add each of these:

| Secret Name | Value (from your .env file) |
|-------------|---------------------------|
| `NG_APP_FIREBASE_API_KEY` | `AIzaSyCRDHNktClKbN8nvLYiILZ_BqD9PemhpeU` |
| `NG_APP_FIREBASE_AUTH_DOMAIN` | `angular-quiz-2025.firebaseapp.com` |
| `NG_APP_FIREBASE_PROJECT_ID` | `angular-quiz-2025` |
| `NG_APP_FIREBASE_STORAGE_BUCKET` | `angular-quiz-2025.firebasestorage.app` |
| `NG_APP_FIREBASE_MESSAGING_SENDER_ID` | `352574521843` |
| `NG_APP_FIREBASE_APP_ID` | `1:352574521843:web:0bbf5d718b8dd7fe1fd286` |
| `NG_APP_FIREBASE_MEASUREMENT_ID` | `G-ZF9TPLQCL5` |

### Step 2: GitHub Actions Workflow

The workflow in `.github/workflows/deploy-gh-pages.yml` is now configured to:

1. **Create .env file from secrets** - Dynamically creates the .env file during build
2. **Pass environment variables to build** - Also passes them directly to the build process

Both approaches are included for maximum compatibility.

### Step 3: Deploy

Once the secrets are set up:

```bash
git add .
git commit -m "Configure environment variables for deployment"
git push origin master
```

The GitHub Action will automatically:
- Fetch the secrets
- Create the .env file
- Build the Angular app with proper environment variables
- Deploy to the `webapp` branch

## 🔧 Method 2: Alternative Approaches

### Option A: Public Environment Variables

If your Firebase config can be public (it often can be for frontend apps), you can hardcode them in the workflow:

```yaml
- name: Create .env file
  run: |
    echo "NG_APP_FIREBASE_API_KEY=AIzaSyCRDHNktClKbN8nvLYiILZ_BqD9PemhpeU" >> .env
    echo "NG_APP_FIREBASE_AUTH_DOMAIN=angular-quiz-2025.firebaseapp.com" >> .env
    # ... etc
```

### Option B: Separate Environment Files

Create production environment files that can be committed:

1. Create `.env.production`:
```bash
NG_APP_FIREBASE_API_KEY=your_production_key
NG_APP_FIREBASE_AUTH_DOMAIN=your_production_domain
# etc...
```

2. Modify `load-env.js` to use different files for different environments.

### Option C: Direct Angular Environment Configuration

Modify the Angular environment files to use process.env directly:

`src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: process.env['NG_APP_FIREBASE_API_KEY'],
    authDomain: process.env['NG_APP_FIREBASE_AUTH_DOMAIN'],
    projectId: process.env['NG_APP_FIREBASE_PROJECT_ID'],
    // etc...
  }
};
```

## 🚀 Quick Setup Commands

1. **Set up all secrets at once** (run these in your local terminal):

```bash
# You'll need GitHub CLI installed: https://cli.github.com/
gh secret set NG_APP_FIREBASE_API_KEY --body "xxxx"
gh secret set NG_APP_FIREBASE_AUTH_DOMAIN --body "xxxx"
gh secret set NG_APP_FIREBASE_PROJECT_ID --body "xxxx"
gh secret set NG_APP_FIREBASE_STORAGE_BUCKET --body "xxxx"
gh secret set NG_APP_FIREBASE_MESSAGING_SENDER_ID --body "xxxx"
gh secret set NG_APP_FIREBASE_APP_ID --body "xxxx"
gh secret set NG_APP_FIREBASE_MEASUREMENT_ID --body "xxxx"
```

2. **Deploy**:
```bash
git push origin master
```

## 🔍 Verification

After deployment, check:

1. **GitHub Actions tab** - Ensure the workflow completes successfully
2. **Webapp branch** - Verify files are deployed
3. **Live site** - Test Firebase functionality works

## 📝 Notes

- **Security**: Method 1 (GitHub Secrets) is most secure
- **Firebase**: Frontend Firebase configs are generally safe to be public
- **Backup**: Keep a local backup of your .env file
- **Testing**: Test the deployment process with non-sensitive values first

## 🔧 Troubleshooting

If deployment fails:

1. **Check secrets** - Ensure all secrets are properly set in GitHub
2. **Check logs** - Review GitHub Actions logs for errors
3. **Test locally** - Run `npm run build:prod` with the same environment variables
4. **Verify .env** - Ensure the .env file is being created correctly during CI

The workflow now handles environment variables securely and automatically creates them during the build process for the webapp branch deployment.