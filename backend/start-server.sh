#!/bin/bash

echo "🚀 Starting We Love Pet Backend Server"
echo "======================================"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔧 Starting server..."
echo "Press Ctrl+C to stop the server"
echo ""

# Start the fixed server
node scripts/backend-server-fixed.js
