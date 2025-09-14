const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

admin.initializeApp(); // dùng default credentials
const db = admin.firestore();

const app = express();

// CORS configuration following your security guidelines
app.use(cors({
  origin: [
    'https://YOUR_USERNAME.github.io', // Update with your GitHub username
    'http://localhost:4200',           // Development server
    'http://localhost:56359'           // Alternative dev port
  ]
}));
app.use(express.json());

// API: Lấy danh sách câu hỏi (Get quiz questions)
app.get('/api/quiz', async (req, res) => {
  try {
    const snapshot = await db.collection('questions').get();
    const questions = [];
    snapshot.forEach(doc => {
      questions.push({ id: doc.id, ...doc.data() });
    });
    res.json({ questions });
  } catch (err) {
    console.error('Error getting questions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API: Thêm câu hỏi mới (Add new question)
app.post('/api/questions', async (req, res) => {
  try {
    const { question, options, correct } = req.body;
    
    // Validation
    if (!question || !options || !Array.isArray(options) || typeof correct !== 'number') {
      return res.status(400).json({ error: 'Invalid question data' });
    }
    
    const docRef = await db.collection('questions').add({
      question,
      options,
      correct,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ id: docRef.id, success: true });
  } catch (err) {
    console.error('Error adding question:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API: Cập nhật câu hỏi (Update question)
app.put('/api/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, correct } = req.body;
    
    await db.collection('questions').doc(id).update({
      question,
      options,
      correct,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating question:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API: Xóa câu hỏi (Delete question)
app.delete('/api/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('questions').doc(id).delete();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting question:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API: Lưu kết quả quiz (Submit quiz results)
app.post('/api/submit', async (req, res) => {
  try {
    const { answers, score, totalQuestions, completedAt } = req.body;
    
    // Validation
    if (!answers || typeof score !== 'number' || typeof totalQuestions !== 'number') {
      return res.status(400).json({ error: 'Invalid submission data' });
    }
    
    const docRef = await db.collection('quiz-results').add({
      answers,
      score,
      totalQuestions,
      completedAt,
      submittedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ id: docRef.id, success: true });
  } catch (err) {
    console.error('Error saving quiz result:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API: Lấy thống kê (Get statistics)
app.get('/api/stats', async (req, res) => {
  try {
    const questionsSnapshot = await db.collection('questions').get();
    const resultsSnapshot = await db.collection('quiz-results').get();
    
    const totalQuestions = questionsSnapshot.size;
    const totalResults = resultsSnapshot.size;
    
    let totalScore = 0;
    resultsSnapshot.forEach(doc => {
      totalScore += doc.data().score || 0;
    });
    
    const averageScore = totalResults > 0 ? (totalScore / totalResults) : 0;
    
    res.json({
      totalQuestions,
      totalResults,
      averageScore: Math.round(averageScore * 100) / 100
    });
  } catch (err) {
    console.error('Error getting stats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Export as single HTTPS function (following your guide)
exports.api = functions.https.onRequest(app);