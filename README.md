# LinkedIn Profile Optimizer

A comprehensive AI-powered LinkedIn profile optimization system with MCP server integration, featuring multiple AI models, automated analysis, and progress tracking.

## Features

### 🤖 AI-Powered Analysis
- Multiple AI model support (GPT-4, Claude, Gemini Pro)
- Smart AI that automatically selects the best model for your profile
- Comprehensive profile scoring across multiple dimensions

### 🎯 Optimization Modes
- **Manual Mode**: Get detailed recommendations and step-by-step instructions
- **Automated Mode**: Let AI automatically optimize your profile with minimal input

### 📊 Advanced Analytics
- Real-time optimization scoring
- Progress tracking over time
- Before/after comparisons
- Detailed improvement metrics

### 🔐 Secure Integration
- LinkedIn OAuth authentication
- Secure profile data handling
- Privacy-focused design

### 💾 Data Management
- Conversation history storage
- Optimization session tracking
- Progress analytics
- Export capabilities

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Zustand** for state management
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **SQLite** database
- **JWT** authentication
- **bcrypt** for password hashing
- **CORS** enabled

### AI Integration
- OpenAI GPT-4 API
- Anthropic Claude API
- Google Gemini Pro API
- Custom AI model selection logic

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd linkedin-profile-optimizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

4. **Start the development servers**
   
   Frontend (Vite):
   ```bash
   npm run dev
   ```
   
   Backend (Express):
   ```bash
   npm run server
   ```

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-here

# AI API Keys
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
GOOGLE_AI_API_KEY=your-google-ai-api-key

# LinkedIn API (for production)
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/linkedin/callback
```

### Database Setup

The application uses SQLite for development. The database will be automatically created when you start the server for the first time.

Tables created:
- `users` - User accounts and authentication
- `profiles` - LinkedIn profile data
- `optimization_scores` - Historical scoring data
- `ai_conversations` - Chat history with AI models
- `optimization_sessions` - Optimization session records

## Usage

### Getting Started

1. **Sign Up/Login**
   - Create an account or sign in with existing credentials
   - Connect your LinkedIn account for profile analysis

2. **Profile Analysis**
   - View your current LinkedIn profile data
   - Get an initial optimization score
   - Review detailed scoring breakdown

3. **Choose Optimization Mode**
   - **Manual**: Get recommendations and implement changes yourself
   - **Automated**: Let AI make changes automatically (with your permission)

4. **Select AI Model**
   - Choose from available AI models
   - Use Smart AI for automatic model selection
   - Each model has different strengths for various profile aspects

5. **Review and Apply Changes**
   - Review AI-generated suggestions
   - Apply changes selectively or all at once
   - Track your progress over time

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `POST /api/auth/linkedin` - LinkedIn OAuth

#### Profile Management
- `GET /api/profile` - Get user profile data
- `POST /api/profile` - Update profile data

#### Optimization
- `POST /api/optimize` - Run AI optimization
- `GET /api/scores` - Get optimization scores
- `POST /api/scores` - Save optimization scores

#### History & Analytics
- `GET /api/sessions` - Get optimization sessions
- `GET /api/conversations` - Get AI conversation history

## MCP Server Integration

The system includes MCP (Model Context Protocol) server capabilities for:

- **Profile Data Context**: Provides AI models with structured profile information
- **Optimization History**: Maintains context of previous optimizations
- **Industry-Specific Guidelines**: Tailors recommendations based on user's industry
- **Performance Metrics**: Tracks and provides optimization effectiveness data

## AI Model Features

### Smart AI (Default)
- Automatically selects the best model for each optimization task
- Combines strengths of multiple AI models
- Optimized for LinkedIn-specific content

### GPT-4
- Excellent for creative writing and comprehensive analysis
- Strong performance on headline and summary optimization
- Good for industry-specific recommendations

### Claude
- Superior for professional tone and clarity
- Excellent at maintaining authenticity
- Strong performance on experience descriptions

### Gemini Pro
- Great for technical profiles and skill optimization
- Strong analytical capabilities
- Good for data-driven recommendations

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **CORS Protection**: Configured for secure cross-origin requests
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: API rate limiting for abuse prevention

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@linkedinoptimizer.com or create an issue in the GitHub repository.

## Roadmap

- [ ] Real LinkedIn API integration
- [ ] Advanced analytics dashboard
- [ ] Team collaboration features
- [ ] Mobile app development
- [ ] Integration with other professional platforms
- [ ] Advanced AI model fine-tuning
- [ ] Bulk optimization for teams
- [ ] A/B testing for optimization strategies