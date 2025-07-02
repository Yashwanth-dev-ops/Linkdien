const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cron = require('node-cron')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const winston = require('winston')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const LinkedInAPI = require('./linkedin-api')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

// Enhanced logging
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'linkedin-optimizer' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

// Enhanced middleware
app.use(helmet())
app.use(compression())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || 'uploads/'
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  }
})

// Database setup with enhanced schema
const db = new sqlite3.Database('./linkedin_optimizer.db')

// Initialize LinkedIn API
const linkedinAPI = new LinkedInAPI()

// Enhanced database initialization
db.serialize(() => {
  // Users table with additional fields
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    linkedin_id TEXT,
    linkedin_access_token TEXT,
    profile_picture TEXT,
    industry TEXT,
    location TEXT,
    timezone TEXT DEFAULT 'UTC',
    preferences TEXT, -- JSON string
    subscription_tier TEXT DEFAULT 'free',
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

  // Enhanced profiles table
  db.run(`CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    headline TEXT,
    summary TEXT,
    experience TEXT, -- JSON string
    education TEXT, -- JSON string
    skills TEXT, -- JSON string
    languages TEXT, -- JSON string
    certifications TEXT, -- JSON string
    connections INTEGER DEFAULT 0,
    profile_views INTEGER DEFAULT 0,
    search_appearances INTEGER DEFAULT 0,
    profile_completeness REAL DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`)

  // Enhanced optimization scores table
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
    industry_comparison REAL,
    percentile_rank REAL,
    ai_model_used TEXT,
    optimization_version TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`)

  // Enhanced AI conversations table
  db.run(`CREATE TABLE IF NOT EXISTS ai_conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_id TEXT NOT NULL,
    ai_model TEXT NOT NULL,
    conversation_data TEXT, -- JSON string
    summary TEXT,
    tokens_used INTEGER DEFAULT 0,
    cost REAL DEFAULT 0,
    satisfaction_rating INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`)

  // Enhanced optimization sessions table
  db.run(`CREATE TABLE IF NOT EXISTS optimization_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_id TEXT UNIQUE NOT NULL,
    session_type TEXT NOT NULL, -- 'manual' or 'auto'
    ai_model TEXT NOT NULL,
    score_before INTEGER NOT NULL,
    score_after INTEGER NOT NULL,
    improvements_count INTEGER NOT NULL,
    improvements_data TEXT, -- JSON string
    applied_changes TEXT, -- JSON string
    status TEXT DEFAULT 'completed',
    duration_seconds INTEGER,
    user_feedback TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`)

  // Analytics table
  db.run(`CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    event_type TEXT NOT NULL,
    event_data TEXT, -- JSON string
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`)

  // Notifications table
  db.run(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`)

  logger.info('Database initialized successfully')
})

// Enhanced JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      logger.warn(`Invalid token attempt: ${err.message}`)
      return res.status(403).json({ error: 'Invalid token' })
    }
    req.user = user
    next()
  })
}

// Enhanced auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, industry, location } = req.body

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    db.run(
      'INSERT INTO users (email, password, name, industry, location) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, industry || null, location || null],
      function(err) {
        if (err) {
          logger.error('Registration error:', err)
          return res.status(400).json({ error: 'User already exists or invalid data' })
        }

        const token = jwt.sign(
          { userId: this.lastID, email },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        )

        // Log analytics event
        db.run(
          'INSERT INTO analytics (user_id, event_type, event_data) VALUES (?, ?, ?)',
          [this.lastID, 'user_registered', JSON.stringify({ email, industry, location })]
        )

        logger.info(`New user registered: ${email}`)

        res.json({
          token,
          user: { id: this.lastID, email, name, industry, location }
        })
      }
    )
  } catch (error) {
    logger.error('Registration error:', error)
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
          logger.warn(`Failed login attempt: ${email}`)
          return res.status(400).json({ error: 'Invalid credentials' })
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
          logger.warn(`Invalid password attempt: ${email}`)
          return res.status(400).json({ error: 'Invalid credentials' })
        }

        // Update last login
        db.run(
          'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
          [user.id]
        )

        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        )

        // Log analytics event
        db.run(
          'INSERT INTO analytics (user_id, event_type, event_data) VALUES (?, ?, ?)',
          [user.id, 'user_login', JSON.stringify({ email })]
        )

        logger.info(`User logged in: ${email}`)

        res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            linkedin_id: user.linkedin_id,
            profile_picture: user.profile_picture,
            industry: user.industry,
            location: user.location
          }
        })
      }
    )
  } catch (error) {
    logger.error('Login error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Real LinkedIn OAuth integration
app.post('/api/auth/linkedin', authenticateToken, async (req, res) => {
  try {
    const { access_token } = req.body

    if (!access_token) {
      return res.status(400).json({ error: 'Access token required' })
    }

    // Fetch profile from LinkedIn API
    const profileData = await linkedinAPI.getProfile(access_token)

    // Update user with LinkedIn data
    db.run(
      `UPDATE users SET 
       linkedin_id = ?, 
       linkedin_access_token = ?, 
       profile_picture = ?,
       updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [profileData.id, access_token, profileData.profilePicture, req.user.userId],
      function(err) {
        if (err) {
          logger.error('LinkedIn integration error:', err)
          return res.status(500).json({ error: 'Failed to integrate LinkedIn' })
        }

        // Save profile data
        const profileQuery = `
          INSERT OR REPLACE INTO profiles 
          (user_id, headline, summary, experience, education, skills, connections, profile_views, last_updated)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `

        db.run(
          profileQuery,
          [
            req.user.userId,
            profileData.headline,
            profileData.summary,
            JSON.stringify(profileData.experience),
            JSON.stringify(profileData.education),
            JSON.stringify(profileData.skills),
            profileData.connections,
            0 // Profile views will be fetched separately
          ],
          function(profileErr) {
            if (profileErr) {
              logger.error('Profile save error:', profileErr)
            }

            logger.info(`LinkedIn integrated for user: ${req.user.userId}`)

            res.json({
              success: true,
              profile: profileData
            })
          }
        )
      }
    )
  } catch (error) {
    logger.error('LinkedIn OAuth error:', error)
    res.status(500).json({ error: 'LinkedIn integration failed' })
  }
})

// Enhanced profile routes
app.get('/api/profile', authenticateToken, (req, res) => {
  const query = `
    SELECT p.*, u.linkedin_access_token 
    FROM profiles p 
    LEFT JOIN users u ON p.user_id = u.id 
    WHERE p.user_id = ?
  `

  db.get(query, [req.user.userId], async (err, profile) => {
    if (err) {
      logger.error('Profile fetch error:', err)
      return res.status(500).json({ error: 'Server error' })
    }

    if (!profile) {
      return res.json(null)
    }

    // If user has LinkedIn token, fetch fresh analytics
    if (profile.linkedin_access_token) {
      try {
        const analytics = await linkedinAPI.getProfileAnalytics(profile.linkedin_access_token)
        
        // Update profile with fresh analytics
        db.run(
          'UPDATE profiles SET profile_views = ?, search_appearances = ? WHERE user_id = ?',
          [analytics.profileViews, analytics.searchAppearances, req.user.userId]
        )

        profile.profile_views = analytics.profileViews
        profile.search_appearances = analytics.searchAppearances
      } catch (analyticsError) {
        logger.warn('Analytics fetch failed:', analyticsError.message)
      }
    }

    res.json({
      ...profile,
      experience: JSON.parse(profile.experience || '[]'),
      education: JSON.parse(profile.education || '[]'),
      skills: JSON.parse(profile.skills || '[]'),
      languages: JSON.parse(profile.languages || '[]'),
      certifications: JSON.parse(profile.certifications || '[]')
    })
  })
})

// Enhanced optimization endpoint with MCP integration
app.post('/api/optimize', authenticateToken, async (req, res) => {
  try {
    const { mode, ai_model, profile_data, preferences } = req.body
    const sessionId = `opt_${Date.now()}_${req.user.userId}`

    // Call MCP server for optimization
    const mcpResponse = await fetch('http://localhost:3002/api/mcp/optimize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        profileData: profile_data,
        mode,
        modelId: ai_model,
        preferences
      })
    })

    if (!mcpResponse.ok) {
      throw new Error('MCP optimization failed')
    }

    const optimizationResults = await mcpResponse.json()

    // Save optimization session
    db.run(
      `INSERT INTO optimization_sessions 
       (user_id, session_id, session_type, ai_model, score_before, score_after, 
        improvements_count, improvements_data, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.userId,
        sessionId,
        mode,
        ai_model,
        optimizationResults.scoreImprovement?.before || 0,
        optimizationResults.scoreImprovement?.after || 0,
        optimizationResults.improvements?.length || 0,
        JSON.stringify(optimizationResults.improvements || []),
        'completed'
      ]
    )

    // Log analytics event
    db.run(
      'INSERT INTO analytics (user_id, event_type, event_data) VALUES (?, ?, ?)',
      [req.user.userId, 'optimization_completed', JSON.stringify({ mode, ai_model, sessionId })]
    )

    logger.info(`Optimization completed for user ${req.user.userId}, session: ${sessionId}`)

    res.json({
      ...optimizationResults,
      sessionId
    })
  } catch (error) {
    logger.error('Optimization error:', error)
    res.status(500).json({ error: 'Optimization failed' })
  }
})

// File upload endpoint
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    logger.info(`File uploaded by user ${req.user.userId}: ${req.file.filename}`)

    res.json({
      success: true,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      path: req.file.path
    })
  } catch (error) {
    logger.error('File upload error:', error)
    res.status(500).json({ error: 'File upload failed' })
  }
})

// Enhanced analytics endpoint
app.get('/api/analytics', authenticateToken, (req, res) => {
  const { timeRange = '30d' } = req.query
  
  let dateFilter = ''
  switch (timeRange) {
    case '7d':
      dateFilter = "AND created_at >= datetime('now', '-7 days')"
      break
    case '30d':
      dateFilter = "AND created_at >= datetime('now', '-30 days')"
      break
    case '90d':
      dateFilter = "AND created_at >= datetime('now', '-90 days')"
      break
    case '1y':
      dateFilter = "AND created_at >= datetime('now', '-1 year')"
      break
  }

  const queries = {
    scores: `SELECT * FROM optimization_scores WHERE user_id = ? ${dateFilter} ORDER BY created_at DESC`,
    sessions: `SELECT * FROM optimization_sessions WHERE user_id = ? ${dateFilter} ORDER BY created_at DESC`,
    analytics: `SELECT * FROM analytics WHERE user_id = ? ${dateFilter} ORDER BY timestamp DESC`
  }

  Promise.all([
    new Promise((resolve, reject) => {
      db.all(queries.scores, [req.user.userId], (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    }),
    new Promise((resolve, reject) => {
      db.all(queries.sessions, [req.user.userId], (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    }),
    new Promise((resolve, reject) => {
      db.all(queries.analytics, [req.user.userId], (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })
  ]).then(([scores, sessions, analytics]) => {
    res.json({
      scores,
      sessions: sessions.map(session => ({
        ...session,
        improvements_data: JSON.parse(session.improvements_data || '[]')
      })),
      analytics: analytics.map(event => ({
        ...event,
        event_data: JSON.parse(event.event_data || '{}')
      }))
    })
  }).catch(error => {
    logger.error('Analytics fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch analytics' })
  })
})

// Notifications endpoint
app.get('/api/notifications', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
    [req.user.userId],
    (err, notifications) => {
      if (err) {
        logger.error('Notifications fetch error:', err)
        return res.status(500).json({ error: 'Server error' })
      }
      res.json(notifications)
    }
  )
})

// Mark notification as read
app.put('/api/notifications/:id/read', authenticateToken, (req, res) => {
  db.run(
    'UPDATE notifications SET read_status = TRUE WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.userId],
    function(err) {
      if (err) {
        logger.error('Notification update error:', err)
        return res.status(500).json({ error: 'Server error' })
      }
      res.json({ success: true })
    }
  )
})

// Enhanced scheduled tasks
cron.schedule('0 9 * * 1', () => {
  logger.info('Running weekly profile analysis...')
  
  // Get users who opted in for weekly analysis
  db.all(
    "SELECT id, email, name FROM users WHERE preferences LIKE '%weekly_analysis\":true%'",
    [],
    (err, users) => {
      if (err) {
        logger.error('Weekly analysis error:', err)
        return
      }

      users.forEach(user => {
        // Create notification for weekly analysis
        db.run(
          'INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)',
          [
            user.id,
            'weekly_analysis',
            'Weekly Profile Analysis Ready',
            'Your weekly LinkedIn profile analysis is ready. Check your dashboard for insights.'
          ]
        )
      })

      logger.info(`Weekly analysis notifications sent to ${users.length} users`)
    }
  )
})

// Health check with detailed status
app.get('/api/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  }

  // Check database connection
  db.get('SELECT 1', [], (err) => {
    if (err) {
      healthCheck.status = 'ERROR'
      healthCheck.database = 'DISCONNECTED'
      logger.error('Database health check failed:', err)
    } else {
      healthCheck.database = 'CONNECTED'
    }

    res.json(healthCheck)
  })
})

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error)
  res.status(500).json({ error: 'Internal server error' })
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  db.close((err) => {
    if (err) {
      logger.error('Database close error:', err)
    } else {
      logger.info('Database connection closed')
    }
    process.exit(0)
  })
})

app.listen(PORT, () => {
  logger.info(`Enhanced LinkedIn Optimizer server running on port ${PORT}`)
})

module.exports = app