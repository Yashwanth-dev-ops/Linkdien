const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cron = require('node-cron')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Database setup
const db = new sqlite3.Database('./linkedin_optimizer.db')

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    linkedin_id TEXT,
    profile_picture TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

  // Profiles table
  db.run(`CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    headline TEXT,
    summary TEXT,
    experience TEXT, -- JSON string
    education TEXT, -- JSON string
    skills TEXT, -- JSON string
    connections INTEGER DEFAULT 0,
    profile_views INTEGER DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`)

  // Optimization scores table
  db.run(`CREATE TABLE IF NOT EXISTS optimization_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    overall_score INTEGER NOT NULL,
    headline_score INTEGER NOT NULL,
    summary_score INTEGER NOT NULL,
    experience_score INTEGER NOT NULL,
    skills_score INTEGER NOT NULL,
    completeness_score INTEGER NOT NULL,
    engagement_score INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`)

  // AI conversations table
  db.run(`CREATE TABLE IF NOT EXISTS ai_conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    ai_model TEXT NOT NULL,
    conversation_data TEXT, -- JSON string
    summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`)

  // Optimization sessions table
  db.run(`CREATE TABLE IF NOT EXISTS optimization_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_type TEXT NOT NULL, -- 'manual' or 'auto'
    ai_model TEXT NOT NULL,
    score_before INTEGER NOT NULL,
    score_after INTEGER NOT NULL,
    improvements_count INTEGER NOT NULL,
    improvements_data TEXT, -- JSON string
    status TEXT DEFAULT 'completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`)
})

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.sendStatus(401)
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    db.run(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name],
      function(err) {
        if (err) {
          return res.status(400).json({ error: 'User already exists' })
        }

        const token = jwt.sign(
          { userId: this.lastID, email },
          process.env.JWT_SECRET || 'your-secret-key'
        )

        res.json({
          token,
          user: { id: this.lastID, email, name }
        })
      }
    )
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    db.get(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, user) => {
        if (err || !user) {
          return res.status(400).json({ error: 'Invalid credentials' })
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
          return res.status(400).json({ error: 'Invalid credentials' })
        }

        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_SECRET || 'your-secret-key'
        )

        res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            linkedin_id: user.linkedin_id,
            profile_picture: user.profile_picture
          }
        })
      }
    )
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Profile routes
app.get('/api/profile', authenticateToken, (req, res) => {
  db.get(
    'SELECT * FROM profiles WHERE user_id = ?',
    [req.user.userId],
    (err, profile) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' })
      }

      if (!profile) {
        return res.json(null)
      }

      res.json({
        ...profile,
        experience: JSON.parse(profile.experience || '[]'),
        education: JSON.parse(profile.education || '[]'),
        skills: JSON.parse(profile.skills || '[]')
      })
    }
  )
})

app.post('/api/profile', authenticateToken, (req, res) => {
  const {
    headline,
    summary,
    experience,
    education,
    skills,
    connections,
    profile_views
  } = req.body

  const query = `
    INSERT OR REPLACE INTO profiles 
    (user_id, headline, summary, experience, education, skills, connections, profile_views, last_updated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `

  db.run(
    query,
    [
      req.user.userId,
      headline,
      summary,
      JSON.stringify(experience),
      JSON.stringify(education),
      JSON.stringify(skills),
      connections,
      profile_views
    ],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Server error' })
      }
      res.json({ success: true, id: this.lastID })
    }
  )
})

// Optimization scores routes
app.get('/api/scores', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM optimization_scores WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.userId],
    (err, scores) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' })
      }
      res.json(scores)
    }
  )
})

app.post('/api/scores', authenticateToken, (req, res) => {
  const {
    overall_score,
    headline_score,
    summary_score,
    experience_score,
    skills_score,
    completeness_score,
    engagement_score
  } = req.body

  db.run(
    `INSERT INTO optimization_scores 
     (user_id, overall_score, headline_score, summary_score, experience_score, 
      skills_score, completeness_score, engagement_score)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req.user.userId,
      overall_score,
      headline_score,
      summary_score,
      experience_score,
      skills_score,
      completeness_score,
      engagement_score
    ],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Server error' })
      }
      res.json({ success: true, id: this.lastID })
    }
  )
})

// AI conversations routes
app.get('/api/conversations', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM ai_conversations WHERE user_id = ? ORDER BY updated_at DESC',
    [req.user.userId],
    (err, conversations) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' })
      }

      const formattedConversations = conversations.map(conv => ({
        ...conv,
        conversation_data: JSON.parse(conv.conversation_data || '[]')
      }))

      res.json(formattedConversations)
    }
  )
})

app.post('/api/conversations', authenticateToken, (req, res) => {
  const { ai_model, conversation_data, summary } = req.body

  db.run(
    'INSERT INTO ai_conversations (user_id, ai_model, conversation_data, summary) VALUES (?, ?, ?, ?)',
    [req.user.userId, ai_model, JSON.stringify(conversation_data), summary],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Server error' })
      }
      res.json({ success: true, id: this.lastID })
    }
  )
})

// Optimization sessions routes
app.get('/api/sessions', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM optimization_sessions WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.userId],
    (err, sessions) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' })
      }

      const formattedSessions = sessions.map(session => ({
        ...session,
        improvements_data: JSON.parse(session.improvements_data || '[]')
      }))

      res.json(formattedSessions)
    }
  )
})

app.post('/api/sessions', authenticateToken, (req, res) => {
  const {
    session_type,
    ai_model,
    score_before,
    score_after,
    improvements_count,
    improvements_data
  } = req.body

  db.run(
    `INSERT INTO optimization_sessions 
     (user_id, session_type, ai_model, score_before, score_after, improvements_count, improvements_data)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      req.user.userId,
      session_type,
      ai_model,
      score_before,
      score_after,
      improvements_count,
      JSON.stringify(improvements_data)
    ],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Server error' })
      }
      res.json({ success: true, id: this.lastID })
    }
  )
})

// AI optimization endpoint
app.post('/api/optimize', authenticateToken, async (req, res) => {
  try {
    const { mode, ai_model, profile_data } = req.body

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock optimization results
    const optimizationResults = {
      mode,
      ai_model,
      improvements: [
        {
          section: 'Headline',
          current: profile_data.headline,
          suggested: `${profile_data.headline} | Expert in Modern Technologies`,
          impact: 'high',
          reason: 'Adding specific expertise increases visibility'
        }
      ],
      score_improvement: {
        before: 75,
        after: 85,
        increase: 10
      }
    }

    res.json(optimizationResults)
  } catch (error) {
    res.status(500).json({ error: 'Optimization failed' })
  }
})

// LinkedIn OAuth simulation endpoint
app.post('/api/auth/linkedin', (req, res) => {
  // This would integrate with LinkedIn's OAuth API
  // For demo purposes, we'll simulate the response
  setTimeout(() => {
    const mockLinkedInData = {
      id: 'linkedin-123',
      email: 'user@linkedin.com',
      name: 'LinkedIn User',
      profile_picture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      headline: 'Senior Software Engineer at Tech Corp',
      summary: 'Passionate software engineer with 5+ years of experience...',
      connections: 847,
      profile_views: 1234
    }

    const token = jwt.sign(
      { userId: 1, email: mockLinkedInData.email },
      process.env.JWT_SECRET || 'your-secret-key'
    )

    res.json({
      token,
      user: mockLinkedInData
    })
  }, 2000)
})

// Scheduled tasks for automated optimization
cron.schedule('0 9 * * 1', () => {
  console.log('Running weekly profile analysis...')
  // This would run automated profile analysis for users who opted in
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})