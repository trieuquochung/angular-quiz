# 🏗️ Firebase Backend Architecture Documentation

## 1. 🎯 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT TIER (Frontend)                       │
├─────────────────────────────────────────────────────────────────┤
│  Angular SPA Application (GitHub Pages CDN)                    │
│  ├── Components (Home, Quiz, Admin, Results)                   │
│  ├── Services (ApiService, QuizService)                        │
│  └── HTTP Client → Firebase Cloud Functions API                │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTPS REST Requests
                                │ (with CORS headers)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   FIREBASE CLOUD FUNCTIONS                      │
├─────────────────────────────────────────────────────────────────┤
│  Express.js HTTP Server (functions/index.js)                   │
│  ├── CORS Middleware Configuration                              │
│  ├── RESTful API Route Handlers:                               │
│  │   ├── GET /api/quiz        (fetch questions)                │
│  │   ├── POST /api/questions  (create question)                │
│  │   ├── PUT /api/questions/:id (update question)              │
│  │   ├── DELETE /api/questions/:id (delete question)           │
│  │   ├── POST /api/submit     (persist quiz results)           │
│  │   └── GET /api/stats       (aggregate statistics)           │
│  └── Firebase Admin SDK ────────────────────┐                   │
└─────────────────────────────────────────────│───────────────────┘
                                              │
                                              │ Admin SDK Database Calls
                                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FIRESTORE DATABASE                         │
├─────────────────────────────────────────────────────────────────┤
│  NoSQL Document-Oriented Database                              │
│  ├── Collection: questions/                                     │
│  │   └── Document: {question, options, correct, createdAt}      │
│  ├── Collection: quiz-results/                                  │
│  │   └── Document: {answers, score, completedAt}                │
│  └── Security Rules Engine (firestore.rules)                   │
└─────────────────────────────────────────────────────────────────┘
```

## 2. 🔥 Cloud Functions Technical Implementation

### 2.1. Function Runtime Execution Model
```
HTTP Request → Google Load Balancer → Container Instance → Express Handler → JSON Response

├── Cold Start: ~2-5 seconds (container initialization)
├── Warm Start: ~100-300ms (existing container reuse)  
└── Instance Lifecycle: ~15 minutes idle timeout → container shutdown
```

### 2.2. Backend Request Processing Pipeline
```javascript
// functions/index.js - Backend service implementation

const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');

// 1. Initialize Firebase Admin SDK (singleton per container instance)
admin.initializeApp();
const db = admin.firestore();

// 2. Create Express application server
const app = express();

// 3. Configure middleware stack
app.use(cors({origin: ['https://trieuquochung.github.io']}));
app.use(express.json());

// 4. Define RESTful API endpoints
app.get('/api/quiz', async (req, res) => {
  try {
    // 5. Execute Firestore query
    const snapshot = await db.collection('questions').get();
    
    // 6. Transform document data
    const questions = [];
    snapshot.forEach(doc => {
      questions.push({id: doc.id, ...doc.data()});
    });
    
    // 7. Return structured JSON response
    res.status(200).json({questions, count: questions.length});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

// 8. Export HTTP Cloud Function
exports.api = functions.https.onRequest(app);
```

## 3. 🗄️ Firestore Database Schema Design

### 3.1. Document-Collection Data Model
```
firestore-database/
├── questions/                          # Collection (Table equivalent)
│   ├── doc1/                          # Document (Row equivalent)
│   │   ├── question: "What is 2+2?"   # Field (Column equivalent)
│   │   ├── options: ["2", "3", "4", "5"]
│   │   ├── correct: 2                  # Index of correct answer
│   │   ├── createdAt: Timestamp        # Server-generated timestamp
│   │   └── updatedAt: Timestamp        # Last modification timestamp
│   ├── doc2/
│   └── doc3/
├── quiz-results/                       # Collection for user submissions
│   ├── result1/                       # Document per quiz attempt
│   │   ├── answers: [0, 2, 1, 3]      # Array of selected answer indices
│   │   ├── score: 75                  # Calculated percentage score
│   │   ├── totalQuestions: 4          # Total questions in quiz
│   │   ├── completedAt: Timestamp     # Quiz completion time
│   │   └── submittedAt: Timestamp     # Result submission time
│   └── result2/
└── users/                             # Future collection for authentication
    ├── user1/
    └── user2/
```

### 3.2. CRUD Database Operations
```javascript
// CREATE - Insert new question document
await db.collection('questions').add({
  question: "What is Angular?",
  options: ["Framework", "Library", "Language", "Tool"],
  correct: 0,
  createdAt: admin.firestore.FieldValue.serverTimestamp()
});

// READ - Query all questions collection
const snapshot = await db.collection('questions').get();

// UPDATE - Modify existing question document
await db.collection('questions').doc(questionId).update({
  question: "Updated question text?",
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
});

// DELETE - Remove question document
await db.collection('questions').doc(questionId).delete();
```

## 4. 🔐 Security Implementation & Access Control

### 4.1. Firestore Security Rules Engine
```javascript
// firestore.rules - Database-level security enforcement
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access, authenticated write operations
    match /questions/{questionId} {
      allow read: if true;                    // Anonymous read access
      allow write: if request.auth != null;  // Requires authentication token
    }
    
    // Open submission access for demo purposes
    match /quiz-results/{resultId} {
      allow read, write: if true;  // Unrestricted access for testing
    }
    
    // User-scoped data protection
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;  // Owner-only access
    }
  }
}
```

### 4.2. Cross-Origin Resource Sharing (CORS) Configuration
```javascript
// functions/index.js - HTTP security middleware
const cors = require('cors');

// Multi-environment origin whitelist
app.use(cors({
  origin: [
    'https://trieuquochung.github.io',   // Production environment
    'http://localhost:4200',             // Angular development server
    'http://localhost:3000',             // Alternative development port
    'http://127.0.0.1:5500'             // VS Code Live Server
  ],
  credentials: true,                     // Enable cookie transmission
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

## 5. 📊 Performance Engineering & Horizontal Scaling

### 5.1. Google Cloud Auto-Scaling Infrastructure
```
HTTP Load → Global Load Balancer → Regional Function Instances → Response

Low Traffic:     1-2 instances    (0-100 req/sec)
Medium Traffic:  5-10 instances   (100-1K req/sec)
High Traffic:    100+ instances   (1K+ req/sec, auto-scaling)
Max Instances:   1000 per region  (configurable concurrency limit)
```

### 5.2. Backend Performance Optimization Strategies
```javascript
// 1. Database connection pooling (singleton pattern)
let db;
if (!admin.apps.length) {
  admin.initializeApp();
  db = admin.firestore();
}

// 2. In-memory response caching layer
const NodeCache = require('node-cache');
const cache = new NodeCache({stdTTL: 600}); // 10-minute TTL

app.get('/api/questions', async (req, res) => {
  const cacheKey = 'all-questions';
  let questions = cache.get(cacheKey);
  
  if (!questions) {
    // Cache miss - fetch from Firestore
    const snapshot = await db.collection('questions').get();
    questions = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    cache.set(cacheKey, questions);
  }
  
  res.json({questions, cached: !!questions});
});

// 3. Batch database operations for efficiency
const batch = db.batch();
questions.forEach(questionData => {
  const docRef = db.collection('questions').doc();
  batch.set(docRef, questionData);
});
await batch.commit(); // Single network round-trip
```

## 6. 💰 Infrastructure Cost Analysis & Budgeting

### 6.1. Google Cloud Pricing Model Components
```
Cloud Functions Billing:
├── Function Invocations: $0.40 per 1M requests (first 2M free monthly)
├── Compute Time: $0.0000025 per 100ms execution
├── Network Egress: $0.12 per GB outbound traffic
└── Memory Allocation: 256MB-8GB configurable (affects pricing)

Firestore Database Billing:
├── Document Read Operations: $0.06 per 100K (50K free daily)
├── Document Write Operations: $0.18 per 100K (20K free daily)  
├── Storage Space: $0.18 per GB/month (1GB free)
└── Network Egress: $0.12 per GB outbound transfer
```

### 6.2. Backend Cost Optimization Techniques
```javascript
// 1. Minimize database read operations through server-side filtering
const questions = await db.collection('questions')
  .where('active', '==', true)        // Server-side filter (reduces reads)
  .limit(20)                          // Result set limit (controlled cost)
  .get();

// 2. Implement hierarchical data structure for related entities
// Subcollection pattern: users/{userId}/quiz-results/{resultId}
// Reduces cross-collection queries and improves data locality

// 3. Implement cursor-based pagination for large datasets
const pageSize = 10;
const lastDocument = await getLastDocument();
const nextPage = await db.collection('questions')
  .orderBy('createdAt')
  .startAfter(lastDocument)            // Cursor-based pagination
  .limit(pageSize)
  .get();
```

## 7. 🔍 Production Monitoring & Observability

### 7.1. Structured Application Logging
```javascript
const {logger} = require('firebase-functions');

app.post('/api/submit', async (req, res) => {
  try {
    logger.info('Quiz submission received', {
      score: req.body.score,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id']
    });
    
    // Business logic execution...
    
    logger.info('Quiz submission processed successfully', {
      submissionId: result.id
    });
    res.status(200).json({success: true, id: result.id});
  } catch (error) {
    logger.error('Quiz submission processing failed', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({error: 'Internal server error'});
  }
});
```

### 7.2. Global Error Handling Middleware
```javascript
// Centralized error handling for unhandled exceptions
app.use((error, req, res, next) => {
  logger.error('Unhandled application error', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  
  res.status(500).json({
    error: 'Internal server error',
    requestId: req.headers['x-request-id'] || 'unknown',
    timestamp: new Date().toISOString()
  });
});
```

---

**🎯 Backend Implementation Guide**: This architecture documentation provides the foundation for implementing a production-ready Firebase backend. Refer to FIREBASE-PROJECT-SETUP.md for deployment procedures and infrastructure provisioning steps.