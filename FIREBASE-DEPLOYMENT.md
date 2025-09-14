# 🚀 Angular Quiz - Firebase Cloud Functions + GitHub Pages Deployment

Triển khai ứng dụng Angular Quiz với kiến trúc hiện đại:
- **Frontend**: Angular hosted trên GitHub Pages
- **Backend**: Node.js/Express hosted trên Firebase Cloud Functions
- **Database**: Cloud Firestore
- **CI/CD**: GitHub Actions tự động deploy

## 📋 Yêu cầu trước khi bắt đầu

### Bước 1: Cài đặt môi trường
```bash
# Node.js 20+ và npm
node --version  # v20.x.x
npm --version   # 10.x.x

# Firebase CLI
npm install -g firebase-tools

# Đăng nhập Firebase
firebase login
```

### Bước 2: Tạo Firebase Project
1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới
3. Bật **Firestore Database** (chế độ test để phát triển)
4. Bật **Cloud Functions** (có thể cần Blaze plan cho production)

## 🔧 Cấu hình Project

### A. Cấu hình Firebase
1. **Lấy config Firebase**:
   ```bash
   # Trong thư mục root project
   firebase init
   # Chọn: Functions, Firestore, Hosting
   # Chọn existing project
   # Runtime: Node.js 20
   # Language: JavaScript
   ```

2. **Cập nhật environment files**:
   
   `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5001/YOUR-PROJECT-ID/us-central1/api',
     firebase: {
       apiKey: "your-api-key",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project.appspot.com",
       messagingSenderId: "123456789",
       appId: "your-app-id"
     }
   };
   ```

   `src/environments/environment.prod.ts`:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api',
     firebase: {
       // Same config as above
     }
   };
   ```

### B. Cấu hình CORS trong Cloud Functions
Trong `functions/index.js`, cập nhật origin cho CORS:
```javascript
app.use(cors({
  origin: [
    'https://YOUR-USERNAME.github.io',  // GitHub Pages URL
    'http://localhost:4200',            // Development
    'http://localhost:56359'            // Alternative dev port
  ]
}));
```

## 🚀 Deployment

### Bước 1: Deploy Cloud Functions
```bash
# Cài đặt dependencies cho functions
cd functions
npm install

# Deploy functions
cd ..
firebase deploy --only functions
```

### Bước 2: Deploy Frontend to GitHub Pages

#### Option 1: Manual Deploy
```bash
# Build production
npm run build:prod

# Deploy to GitHub Pages
npm run deploy:github
```

#### Option 2: Automatic Deploy (Recommended)
Workflow đã được tạo tại `.github/workflows/deploy-gh-pages.yml` sẽ tự động deploy khi push lên main branch.

## 🛠 Development Workflow

### 1. Local Development
```bash
# Terminal 1: Start Firebase Emulators
firebase emulators:start --only functions,firestore

# Terminal 2: Start Angular Dev Server
npm start
```

### 2. Testing
```bash
# Run unit tests
npm test

# Test API endpoints
curl http://localhost:5001/YOUR-PROJECT-ID/us-central1/api/health
```

### 3. Debugging
```bash
# View function logs
firebase functions:log

# Check emulator UI
# http://localhost:4000
```

## 📊 API Endpoints

Sau khi deploy, Cloud Functions sẽ cung cấp các API:

### Questions Management
- `GET /api/quiz` - Lấy danh sách câu hỏi
- `POST /api/questions` - Thêm câu hỏi mới
- `PUT /api/questions/:id` - Cập nhật câu hỏi
- `DELETE /api/questions/:id` - Xóa câu hỏi

### Quiz Results
- `POST /api/submit` - Lưu kết quả quiz
- `GET /api/stats` - Thống kê tổng quan

### System
- `GET /api/health` - Health check

## 🔒 Security & Best Practices

### 1. CORS Configuration
- Chỉ cho phép origins cần thiết
- Không dùng `origin: true` trong production

### 2. Environment Variables
```bash
# Set Firebase config
firebase functions:config:set api.cors.origin="https://yourusername.github.io"
```

### 3. Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /questions/{document} {
      allow read: if true;
      allow write: if request.auth != null; // Chỉ user đã auth
    }
    match /quiz-results/{document} {
      allow read, write: if true; // Hoặc thêm logic auth phù hợp
    }
  }
}
```

## 🎯 Production Checklist

- [ ] Firebase project tạo và config đúng
- [ ] Environment variables cập nhật
- [ ] CORS origins cập nhật cho production domain
- [ ] GitHub repository settings: Pages enabled
- [ ] GitHub Secrets configured (nếu dùng service account)
- [ ] Firestore security rules updated
- [ ] Firebase billing enabled (nếu cần Blaze plan)

## 💰 Cost Management

- **GitHub Pages**: Miễn phí cho public repos
- **Firebase**: 
  - Spark plan: Miễn phí với giới hạn
  - Blaze plan: Pay-as-you-go, có free tier
  - Monitor usage tại Firebase Console

## 🐛 Troubleshooting

### CORS Errors
1. Kiểm tra origin trong browser DevTools
2. Verify CORS config trong `functions/index.js`
3. Đảm bảo đã redeploy functions sau khi thay đổi

### Build Errors
```bash
# Clear caches
npm cache clean --force
ng cache clean

# Reinstall dependencies  
rm -rf node_modules package-lock.json
npm install
```

### Function Deploy Errors
```bash
# Check Firebase CLI version
firebase --version

# Update CLI
npm install -g firebase-tools@latest

# Check project selection
firebase projects:list
firebase use YOUR-PROJECT-ID
```

## 📚 Resources

- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Angular Deployment Guide](https://angular.io/guide/deployment)
- [CORS in Firebase Functions](https://firebase.google.com/docs/functions/http-events#cors)

---

**Built with ❤️ using Angular + Firebase + GitHub Pages**