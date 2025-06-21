#!/bin/bash

# We Love Pet Backend - Installation Script
echo "🚀 We Love Pet Backend - Installation Script"
echo "============================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    echo "Please install npm from: https://www.npmjs.com/get-npm"
    exit 1
fi

echo "✅ Node.js and npm are available"

# Install dependencies
echo "📦 Installing dependencies..."
npm install express bcryptjs jsonwebtoken cors express-rate-limit node-fetch helmet morgan dotenv

# Install dev dependencies
echo "📦 Installing development dependencies..."
npm install --save-dev nodemon jest supertest

echo "✅ Dependencies installed successfully!"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
# We Love Pet Backend Configuration
PORT=3001
NODE_ENV=development
JWT_SECRET=we-love-pet-super-secret-jwt-key-change-this-in-production-$(date +%s)
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:3000
EOL
    echo "✅ .env file created!"
fi

# Create logs directory
mkdir -p logs

echo "🎉 Installation completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start the server: node scripts/backend-server.js"
echo "2. Test the API: node scripts/test-api.js"
echo "3. Visit: http://localhost:3001/api/health"
echo ""
echo "👥 Test credentials:"
echo "   Admin: admin / admin123"
echo "   Manager: manager / manager123"
echo "   Staff: staff / staff123"
