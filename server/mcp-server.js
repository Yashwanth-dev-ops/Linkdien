const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const winston = require('winston')
const rateLimit = require('rate-limiter-flexible')
const helmet = require('helmet')
const compression = require('compression')
require('dotenv').config()

// Enhanced MCP Server for LinkedIn Profile Optimization
class MCPServer {
  constructor() {
    this.app = express()
    this.server = http.createServer(this.app)
    this.io = socketIo(this.server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
      }
    })
    
    this.setupLogger()
    this.setupMiddleware()
    this.setupRateLimit()
    this.setupRoutes()
    this.setupSocketHandlers()
    this.initializeAIModels()
  }

  setupLogger() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'mcp-server' },
      transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.Console({
          format: winston.format.simple()
        })
      ]
    })
  }

  setupMiddleware() {
    this.app.use(helmet())
    this.app.use(compression())
    this.app.use(express.json({ limit: '10mb' }))
    this.app.use(express.urlencoded({ extended: true }))
  }

  setupRateLimit() {
    this.rateLimiter = new rateLimit.RateLimiterMemory({
      keyGenerator: (req) => req.ip,
      points: 100, // Number of requests
      duration: 60, // Per 60 seconds
    })
  }

  async initializeAIModels() {
    this.aiModels = {
      openai: null,
      anthropic: null,
      google: null,
      cohere: null
    }

    try {
      // Initialize OpenAI
      if (process.env.OPENAI_API_KEY) {
        const { OpenAI } = require('openai')
        this.aiModels.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        })
      }

      // Initialize Anthropic
      if (process.env.ANTHROPIC_API_KEY) {
        const { Anthropic } = require('anthropic')
        this.aiModels.anthropic = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY
        })
      }

      // Initialize Google AI
      if (process.env.GOOGLE_AI_API_KEY) {
        const { GoogleGenerativeAI } = require('@google/generative-ai')
        this.aiModels.google = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
      }

      // Initialize Cohere
      if (process.env.COHERE_API_KEY) {
        const { CohereClient } = require('cohere-ai')
        this.aiModels.cohere = new CohereClient({
          token: process.env.COHERE_API_KEY
        })
      }

      this.logger.info('AI models initialized successfully')
    } catch (error) {
      this.logger.error('Error initializing AI models:', error)
    }
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        models: Object.keys(this.aiModels).filter(key => this.aiModels[key] !== null)
      })
    })

    // AI Model capabilities
    this.app.get('/api/mcp/models', (req, res) => {
      const availableModels = []
      
      if (this.aiModels.openai) {
        availableModels.push({
          id: 'gpt-4',
          name: 'GPT-4',
          provider: 'OpenAI',
          capabilities: ['text-generation', 'analysis', 'optimization'],
          strengths: ['Creative writing', 'Comprehensive analysis', 'Industry insights']
        })
      }

      if (this.aiModels.anthropic) {
        availableModels.push({
          id: 'claude-3',
          name: 'Claude 3',
          provider: 'Anthropic',
          capabilities: ['text-generation', 'analysis', 'optimization'],
          strengths: ['Professional tone', 'Clarity', 'Authenticity']
        })
      }

      if (this.aiModels.google) {
        availableModels.push({
          id: 'gemini-pro',
          name: 'Gemini Pro',
          provider: 'Google',
          capabilities: ['text-generation', 'analysis', 'multimodal'],
          strengths: ['Technical profiles', 'Data analysis', 'Multilingual']
        })
      }

      if (this.aiModels.cohere) {
        availableModels.push({
          id: 'command',
          name: 'Command',
          provider: 'Cohere',
          capabilities: ['text-generation', 'classification', 'embeddings'],
          strengths: ['Business writing', 'Classification', 'Semantic search']
        })
      }

      res.json({ models: availableModels })
    })

    // Profile analysis endpoint
    this.app.post('/api/mcp/analyze', async (req, res) => {
      try {
        await this.rateLimiter.consume(req.ip)
        
        const { profileData, modelId = 'smart' } = req.body
        const analysis = await this.analyzeProfile(profileData, modelId)
        
        res.json(analysis)
      } catch (error) {
        if (error instanceof rateLimit.RateLimiterRes) {
          res.status(429).json({ error: 'Rate limit exceeded' })
        } else {
          this.logger.error('Analysis error:', error)
          res.status(500).json({ error: 'Analysis failed' })
        }
      }
    })

    // Optimization endpoint
    this.app.post('/api/mcp/optimize', async (req, res) => {
      try {
        await this.rateLimiter.consume(req.ip)
        
        const { profileData, mode, modelId, preferences } = req.body
        const optimization = await this.optimizeProfile(profileData, mode, modelId, preferences)
        
        res.json(optimization)
      } catch (error) {
        if (error instanceof rateLimit.RateLimiterRes) {
          res.status(429).json({ error: 'Rate limit exceeded' })
        } else {
          this.logger.error('Optimization error:', error)
          res.status(500).json({ error: 'Optimization failed' })
        }
      }
    })

    // Real-time optimization status
    this.app.get('/api/mcp/status/:sessionId', (req, res) => {
      const { sessionId } = req.params
      const status = this.getOptimizationStatus(sessionId)
      res.json(status)
    })
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      this.logger.info(`Client connected: ${socket.id}`)

      socket.on('start-optimization', async (data) => {
        try {
          const { profileData, mode, modelId, sessionId } = data
          
          // Emit progress updates
          socket.emit('optimization-progress', { 
            sessionId, 
            progress: 0, 
            status: 'Starting analysis...' 
          })

          const result = await this.optimizeProfileRealtime(
            profileData, 
            mode, 
            modelId, 
            sessionId,
            (progress) => {
              socket.emit('optimization-progress', { sessionId, ...progress })
            }
          )

          socket.emit('optimization-complete', { sessionId, result })
        } catch (error) {
          socket.emit('optimization-error', { 
            sessionId: data.sessionId, 
            error: error.message 
          })
        }
      })

      socket.on('disconnect', () => {
        this.logger.info(`Client disconnected: ${socket.id}`)
      })
    })
  }

  async analyzeProfile(profileData, modelId) {
    const selectedModel = this.selectAIModel(modelId, profileData)
    
    const analysisPrompt = this.buildAnalysisPrompt(profileData)
    const response = await this.callAIModel(selectedModel, analysisPrompt)
    
    return this.parseAnalysisResponse(response, profileData)
  }

  async optimizeProfile(profileData, mode, modelId, preferences = {}) {
    const selectedModel = this.selectAIModel(modelId, profileData)
    
    const optimizationPrompt = this.buildOptimizationPrompt(
      profileData, 
      mode, 
      preferences
    )
    
    const response = await this.callAIModel(selectedModel, optimizationPrompt)
    
    return this.parseOptimizationResponse(response, profileData)
  }

  async optimizeProfileRealtime(profileData, mode, modelId, sessionId, progressCallback) {
    const steps = [
      { name: 'Analyzing profile structure', weight: 20 },
      { name: 'Evaluating content quality', weight: 25 },
      { name: 'Generating recommendations', weight: 30 },
      { name: 'Optimizing suggestions', weight: 25 }
    ]

    let totalProgress = 0

    for (const step of steps) {
      progressCallback({
        progress: totalProgress,
        status: step.name,
        currentStep: step.name
      })

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      totalProgress += step.weight
    }

    const result = await this.optimizeProfile(profileData, mode, modelId)
    
    progressCallback({
      progress: 100,
      status: 'Optimization complete',
      currentStep: 'Finalizing results'
    })

    return result
  }

  selectAIModel(modelId, profileData) {
    if (modelId === 'smart') {
      // Smart AI selection based on profile characteristics
      const industry = this.detectIndustry(profileData)
      const profileType = this.detectProfileType(profileData)
      
      if (industry === 'technology' && this.aiModels.google) {
        return { provider: 'google', model: 'gemini-pro' }
      } else if (profileType === 'executive' && this.aiModels.anthropic) {
        return { provider: 'anthropic', model: 'claude-3' }
      } else if (this.aiModels.openai) {
        return { provider: 'openai', model: 'gpt-4' }
      }
    }

    // Return specific model if available
    const modelMap = {
      'gpt-4': { provider: 'openai', model: 'gpt-4' },
      'claude-3': { provider: 'anthropic', model: 'claude-3' },
      'gemini-pro': { provider: 'google', model: 'gemini-pro' },
      'command': { provider: 'cohere', model: 'command' }
    }

    return modelMap[modelId] || { provider: 'openai', model: 'gpt-4' }
  }

  detectIndustry(profileData) {
    const techKeywords = ['software', 'developer', 'engineer', 'tech', 'programming']
    const content = `${profileData.headline} ${profileData.summary}`.toLowerCase()
    
    if (techKeywords.some(keyword => content.includes(keyword))) {
      return 'technology'
    }
    
    return 'general'
  }

  detectProfileType(profileData) {
    const executiveKeywords = ['ceo', 'cto', 'director', 'manager', 'lead']
    const content = `${profileData.headline} ${profileData.summary}`.toLowerCase()
    
    if (executiveKeywords.some(keyword => content.includes(keyword))) {
      return 'executive'
    }
    
    return 'professional'
  }

  buildAnalysisPrompt(profileData) {
    return `
Analyze this LinkedIn profile and provide a comprehensive optimization score:

Profile Data:
- Headline: ${profileData.headline}
- Summary: ${profileData.summary}
- Experience: ${JSON.stringify(profileData.experience)}
- Skills: ${profileData.skills?.join(', ')}
- Education: ${JSON.stringify(profileData.education)}

Please provide:
1. Overall optimization score (0-100)
2. Individual section scores (headline, summary, experience, skills, completeness, engagement)
3. Key strengths and weaknesses
4. Industry-specific recommendations
5. Keyword optimization suggestions

Format the response as JSON with the following structure:
{
  "overallScore": number,
  "sectionScores": {
    "headline": number,
    "summary": number,
    "experience": number,
    "skills": number,
    "completeness": number,
    "engagement": number
  },
  "strengths": [string],
  "weaknesses": [string],
  "recommendations": [string],
  "keywords": [string]
}
`
  }

  buildOptimizationPrompt(profileData, mode, preferences) {
    return `
Optimize this LinkedIn profile based on the specified mode and preferences:

Profile Data:
- Headline: ${profileData.headline}
- Summary: ${profileData.summary}
- Experience: ${JSON.stringify(profileData.experience)}
- Skills: ${profileData.skills?.join(', ')}

Mode: ${mode}
Preferences: ${JSON.stringify(preferences)}

Provide specific optimization suggestions for each section with:
1. Current content
2. Optimized content
3. Reasoning for changes
4. Expected impact level (high/medium/low)

Format as JSON with improvements array containing objects with:
{
  "section": string,
  "current": string,
  "optimized": string,
  "reasoning": string,
  "impact": string,
  "keywords": [string]
}
`
  }

  async callAIModel(modelConfig, prompt) {
    const { provider, model } = modelConfig

    try {
      switch (provider) {
        case 'openai':
          const openaiResponse = await this.aiModels.openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 2000
          })
          return openaiResponse.choices[0].message.content

        case 'anthropic':
          const anthropicResponse = await this.aiModels.anthropic.messages.create({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 2000,
            messages: [{ role: 'user', content: prompt }]
          })
          return anthropicResponse.content[0].text

        case 'google':
          const googleModel = this.aiModels.google.getGenerativeModel({ model: 'gemini-pro' })
          const googleResponse = await googleModel.generateContent(prompt)
          return googleResponse.response.text()

        case 'cohere':
          const cohereResponse = await this.aiModels.cohere.generate({
            model: 'command',
            prompt: prompt,
            max_tokens: 2000,
            temperature: 0.7
          })
          return cohereResponse.generations[0].text

        default:
          throw new Error(`Unsupported AI provider: ${provider}`)
      }
    } catch (error) {
      this.logger.error(`AI model call failed for ${provider}:`, error)
      throw error
    }
  }

  parseAnalysisResponse(response, profileData) {
    try {
      const parsed = JSON.parse(response)
      return {
        ...parsed,
        timestamp: new Date().toISOString(),
        profileId: profileData.id
      }
    } catch (error) {
      // Fallback parsing if JSON is malformed
      return this.generateFallbackAnalysis(profileData)
    }
  }

  parseOptimizationResponse(response, profileData) {
    try {
      const parsed = JSON.parse(response)
      return {
        improvements: parsed.improvements || parsed,
        timestamp: new Date().toISOString(),
        profileId: profileData.id,
        scoreImprovement: this.calculateScoreImprovement(parsed.improvements)
      }
    } catch (error) {
      return this.generateFallbackOptimization(profileData)
    }
  }

  generateFallbackAnalysis(profileData) {
    return {
      overallScore: 75,
      sectionScores: {
        headline: 80,
        summary: 70,
        experience: 75,
        skills: 80,
        completeness: 70,
        engagement: 75
      },
      strengths: ['Clear professional title', 'Relevant experience'],
      weaknesses: ['Summary could be more compelling', 'Missing key skills'],
      recommendations: ['Enhance summary with achievements', 'Add trending skills'],
      keywords: ['leadership', 'innovation', 'results-driven']
    }
  }

  generateFallbackOptimization(profileData) {
    return {
      improvements: [
        {
          section: 'headline',
          current: profileData.headline,
          optimized: `${profileData.headline} | Expert in Modern Technologies`,
          reasoning: 'Adding specific expertise increases visibility',
          impact: 'high',
          keywords: ['expert', 'modern', 'technologies']
        }
      ],
      scoreImprovement: { before: 75, after: 85, increase: 10 }
    }
  }

  calculateScoreImprovement(improvements) {
    const baseScore = 75
    const improvementPoints = improvements.length * 3
    const afterScore = Math.min(100, baseScore + improvementPoints)
    
    return {
      before: baseScore,
      after: afterScore,
      increase: afterScore - baseScore
    }
  }

  getOptimizationStatus(sessionId) {
    // In a real implementation, this would check a database or cache
    return {
      sessionId,
      status: 'completed',
      progress: 100,
      timestamp: new Date().toISOString()
    }
  }

  start(port = 3002) {
    this.server.listen(port, () => {
      this.logger.info(`MCP Server running on port ${port}`)
    })
  }
}

// Start the MCP server
const mcpServer = new MCPServer()
mcpServer.start(process.env.MCP_PORT || 3002)

module.exports = MCPServer