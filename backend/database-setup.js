// Database setup script for production use
const fs = require("fs")
const path = require("path")

// Mock database structure
const databaseSchema = {
  users: {
    id: "string (primary key)",
    username: "string (unique)",
    email: "string (unique)",
    password: "string (hashed)",
    name: "string",
    role: "enum (admin, staff, user)",
    isActive: "boolean",
    createdAt: "datetime",
    updatedAt: "datetime",
    lastLogin: "datetime",
    loginAttempts: "integer",
    lockUntil: "datetime",
  },
  sessions: {
    id: "string (primary key)",
    userId: "string (foreign key)",
    token: "string",
    expiresAt: "datetime",
    createdAt: "datetime",
    ipAddress: "string",
    userAgent: "string",
  },
  auditLogs: {
    id: "string (primary key)",
    userId: "string (foreign key)",
    action: "string",
    resource: "string",
    details: "json",
    ipAddress: "string",
    userAgent: "string",
    createdAt: "datetime",
  },
}

// SQL for PostgreSQL
const postgresqlSchema = `
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'staff', 'user')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE,
  login_attempts INTEGER DEFAULT 0,
  lock_until TIMESTAMP WITH TIME ZONE
);

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ip_address INET,
  user_agent TEXT
);

-- Audit logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Insert default admin user
INSERT INTO users (username, email, password, name, role) VALUES 
('admin', 'admin@welovepet.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ผู้ดูแลระบบ', 'admin');
`

// MongoDB schema (using Mongoose)
const mongooseSchema = `
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'staff', 'user'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date
}, {
  timestamps: true
});

// Session Schema
const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

// Audit Log Schema
const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    required: true
  },
  resource: {
    type: String,
    required: true
  },
  details: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Session: mongoose.model('Session', sessionSchema),
  AuditLog: mongoose.model('AuditLog', auditLogSchema)
};
`

function generateDatabaseFiles() {
  console.log("🗄️  Generating database setup files...\n")

  // Create database directory
  const dbDir = path.join(process.cwd(), "database")
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir)
  }

  // Write PostgreSQL schema
  fs.writeFileSync(path.join(dbDir, "postgresql-schema.sql"), postgresqlSchema)
  console.log("✅ PostgreSQL schema created: database/postgresql-schema.sql")

  // Write Mongoose schema
  fs.writeFileSync(path.join(dbDir, "mongoose-models.js"), mongooseSchema)
  console.log("✅ Mongoose models created: database/mongoose-models.js")

  // Write schema documentation
  fs.writeFileSync(path.join(dbDir, "schema.json"), JSON.stringify(databaseSchema, null, 2))
  console.log("✅ Schema documentation created: database/schema.json")

  // Write environment template
  const envTemplate = `# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/welovepet
MONGODB_URI=mongodb://localhost:27017/welovepet

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
LOGIN_RATE_LIMIT_WINDOW_MS=900000
LOGIN_RATE_LIMIT_MAX_ATTEMPTS=5

# Account Locking
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME_MINUTES=30
`

  fs.writeFileSync(path.join(dbDir, ".env.example"), envTemplate)
  console.log("✅ Environment template created: database/.env.example")

  console.log("\n📋 Database setup files generated successfully!")
  console.log("\n📝 Next steps:")
  console.log("1. Choose your database (PostgreSQL or MongoDB)")
  console.log("2. Copy database/.env.example to .env and configure")
  console.log("3. Run the appropriate schema file in your database")
  console.log("4. Install required dependencies:")
  console.log("   npm install express bcryptjs jsonwebtoken cors express-rate-limit")
  console.log("   For PostgreSQL: npm install pg")
  console.log("   For MongoDB: npm install mongoose")
}

if (require.main === module) {
  generateDatabaseFiles()
}

module.exports = {
  databaseSchema,
  postgresqlSchema,
  mongooseSchema,
}
