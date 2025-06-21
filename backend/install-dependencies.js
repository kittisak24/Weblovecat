// Dependency installation and setup script
const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("🚀 We Love Pet Backend - Dependency Installation")
console.log("=".repeat(50))

// Check if Node.js version is compatible
function checkNodeVersion() {
  const nodeVersion = process.version
  const majorVersion = Number.parseInt(nodeVersion.slice(1).split(".")[0])

  console.log(`📋 Node.js version: ${nodeVersion}`)

  if (majorVersion < 16) {
    console.error("❌ Node.js version 16 or higher is required")
    console.log("Please update Node.js: https://nodejs.org/")
    process.exit(1)
  }

  console.log("✅ Node.js version is compatible")
}

// Check if npm is available
function checkNpm() {
  try {
    const npmVersion = execSync("npm --version", { encoding: "utf8" }).trim()
    console.log(`📋 npm version: ${npmVersion}`)
    console.log("✅ npm is available")
  } catch (error) {
    console.error("❌ npm is not available")
    console.log("Please install npm: https://www.npmjs.com/get-npm")
    process.exit(1)
  }
}

// Install dependencies
function installDependencies() {
  console.log("\n📦 Installing dependencies...")

  try {
    // Install production dependencies
    console.log("Installing production dependencies...")
    execSync("npm install express bcryptjs jsonwebtoken cors express-rate-limit node-fetch helmet morgan dotenv", {
      stdio: "inherit",
    })

    // Install development dependencies
    console.log("\nInstalling development dependencies...")
    execSync("npm install --save-dev nodemon jest supertest", {
      stdio: "inherit",
    })

    console.log("\n✅ All dependencies installed successfully!")
  } catch (error) {
    console.error("❌ Failed to install dependencies:", error.message)
    console.log("\n🔧 Try manual installation:")
    console.log("npm install express bcryptjs jsonwebtoken cors express-rate-limit node-fetch helmet morgan dotenv")
    console.log("npm install --save-dev nodemon jest supertest")
    process.exit(1)
  }
}

// Create .env file if it doesn't exist
function createEnvFile() {
  const envPath = path.join(process.cwd(), ".env")

  if (!fs.existsSync(envPath)) {
    console.log("\n📝 Creating .env file...")

    const envContent = `# We Love Pet Backend Configuration
# Generated on ${new Date().toISOString()}

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=we-love-pet-super-secret-jwt-key-change-this-in-production-${Date.now()}
JWT_EXPIRES_IN=24h

# CORS Configuration
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate Limiting
LOGIN_RATE_LIMIT_WINDOW_MS=900000
LOGIN_RATE_LIMIT_MAX_ATTEMPTS=5

# Account Security
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME_MINUTES=30

# Database Configuration (Optional - currently using in-memory)
# DATABASE_URL=postgresql://username:password@localhost:5432/welovepet
# MONGODB_URI=mongodb://localhost:27017/welovepet

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Email Configuration (for future features)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
`

    fs.writeFileSync(envPath, envContent)
    console.log("✅ .env file created successfully!")
  } else {
    console.log("📋 .env file already exists")
  }
}

// Create logs directory
function createLogsDirectory() {
  const logsDir = path.join(process.cwd(), "logs")

  if (!fs.existsSync(logsDir)) {
    console.log("\n📁 Creating logs directory...")
    fs.mkdirSync(logsDir)
    console.log("✅ Logs directory created!")
  }
}

// Create gitignore if it doesn't exist
function createGitignore() {
  const gitignorePath = path.join(process.cwd(), ".gitignore")

  if (!fs.existsSync(gitignorePath)) {
    console.log("\n📝 Creating .gitignore file...")

    const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Database
database/
*.db
*.sqlite

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Build outputs
dist/
build/
`

    fs.writeFileSync(gitignorePath, gitignoreContent)
    console.log("✅ .gitignore file created!")
  }
}

// Display next steps
function displayNextSteps() {
  console.log("\n🎉 Setup completed successfully!")
  console.log("=".repeat(50))
  console.log("\n📋 Next steps:")
  console.log("1. Start the server:")
  console.log("   npm start")
  console.log("   or")
  console.log("   node scripts/backend-server.js")
  console.log("\n2. Test the API:")
  console.log("   npm test")
  console.log("   or")
  console.log("   node scripts/test-api.js")
  console.log("\n3. Development mode (auto-restart):")
  console.log("   npm run dev")
  console.log("\n4. Generate password hashes:")
  console.log("   npm run hash-password")
  console.log("\n5. Setup database:")
  console.log("   npm run setup-db")
  console.log("\n🌐 Server will run on: http://localhost:3001")
  console.log("🏥 Health check: http://localhost:3001/api/health")
  console.log("\n👥 Test credentials:")
  console.log("   Admin: admin / admin123")
  console.log("   Manager: manager / manager123")
  console.log("   Staff: staff / staff123")
}

// Main setup function
async function setup() {
  try {
    checkNodeVersion()
    checkNpm()
    installDependencies()
    createEnvFile()
    createLogsDirectory()
    createGitignore()
    displayNextSteps()
  } catch (error) {
    console.error("❌ Setup failed:", error.message)
    process.exit(1)
  }
}

// Run setup if this script is executed directly
if (require.main === module) {
  setup()
}

module.exports = { setup }
