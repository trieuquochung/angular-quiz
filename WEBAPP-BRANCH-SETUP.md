# Webapp Branch Deployment Setup

## Overview

This project now uses a dedicated `webapp` branch for GitHub Pages deployment, keeping deployment artifacts separate from the source code in the `master` branch.

## Branch Structure

- **`master`**: Source code, configuration files, documentation
- **`webapp`**: Compiled deployment artifacts (automatically managed)

## Deployment Commands

### Quick Deployment
```bash
npm run deploy:github
```

### Manual Steps
```bash
# 1. Build production version
npm run build:prod

# 2. Deploy to webapp branch
npm run deploy:webapp
```

## What Happens During Deployment

1. **Build Process**: Angular CLI builds optimized production bundles
2. **Branch Creation**: `angular-cli-ghpages` automatically manages the `webapp` branch
3. **File Deployment**: Compiled files are committed to `webapp` branch only
4. **GitHub Pages**: Automatically serves content from `webapp` branch

## Deployment Artifacts (Generated in webapp branch)

- `chunk-*.js` - Code-split JavaScript bundles
- `main-*.js` - Main application bundle
- `styles-*.css` - Compiled stylesheets
- `index.csr.html` - Client-side rendered entry point
- `favicon.ico` - Application icon
- `.nojekyll` - GitHub Pages configuration

## Key Benefits

### ✅ Clean Source Code Repository
- Master branch contains only source files
- No compiled artifacts in version control
- Easier code reviews and collaboration

### ✅ Automated Deployment
- Single command deployment
- Proper branch targeting
- Build and deploy in one step

### ✅ Deployment History
- Separate commit history for deployments
- Easy rollback to previous versions
- Clear separation of concerns

## GitHub Pages Configuration

The repository should be configured in GitHub Pages settings to:
- **Source**: Deploy from a branch
- **Branch**: `webapp`
- **Folder**: `/ (root)`

## Troubleshooting

### If deployment fails:
```bash
# Clear cache and redeploy
rm -rf node_modules/.cache/gh-pages
npm run deploy:github
```

### If GitHub Pages shows 404:
1. Check that `webapp` branch exists
2. Verify GitHub Pages settings point to `webapp` branch
3. Ensure base-href is set correctly in package.json

## Production URL

Your application is deployed at: https://trieuquochung.github.io/angular-quiz/

---

**Note**: Never manually edit files in the `webapp` branch. They are automatically generated during deployment.