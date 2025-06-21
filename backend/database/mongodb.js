// database/mongodb.js - Fixed MongoDB Connection
const mongoose = require('mongoose')

// MongoDB Connection with proper error handling
const connectDB = async () => {
  try {
    // ลบ deprecated options
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/welovepet'
      // ไม่ต้องใส่ options ที่ deprecated แล้ว
    )
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📂 Database: ${conn.connection.name}`)
    
    // ทดสอบการเชื่อมต่อ
    await mongoose.connection.db.admin().ping()
    console.log('🏓 MongoDB ping successful')
    
    return conn
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    
    // แสดง solutions ตาม error type
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 Solutions:')
      console.log('1. Start MongoDB: brew services start mongodb-community')
      console.log('2. Or use MongoDB Atlas (cloud)')
      console.log('3. Or use Docker: docker run -d -p 27017:27017 mongo')
      console.log('4. Check if port 27017 is available: lsof -i :27017')
    }
    
    // ใน development ให้ fallback ไปใช้ memory database
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔄 Falling back to in-memory database for development...')
      return null // ส่งกลับ null เพื่อใช้ memory database
    }
    
    process.exit(1)
  }
}

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
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
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
})

// User Model
const User = mongoose.model('User', userSchema)

// BlacklistedToken Schema
const blacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // 24 hours
  }
})

const BlacklistedToken = mongoose.model('BlacklistedToken', blacklistedTokenSchema)

// Fallback Memory Database (ใช้เมื่อ MongoDB ไม่ได้)
let memoryUsers = [
  {
    id: "1",
    username: "admin",
    email: "admin@welovepet.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    role: "admin",
    name: "ผู้ดูแลระบบ",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    lastLogin: null,
    loginAttempts: 0,
    lockUntil: null,
  },
  {
    id: "2",
    username: "manager",
    email: "manager@welovepet.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    role: "admin",
    name: "ผู้จัดการ",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    lastLogin: null,
    loginAttempts: 0,
    lockUntil: null,
  },
  {
    id: "3",
    username: "staff",
    email: "staff@welovepet.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    role: "staff",
    name: "พนักงาน",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    lastLogin: null,
    loginAttempts: 0,
    lockUntil: null,
  }
]

let memoryBlacklistedTokens = new Set()
let useMongoDB = false

// Helper Functions แบบ Hybrid (MongoDB + Memory fallback)
const findUserByUsername = async (username) => {
  try {
    if (useMongoDB && mongoose.connection.readyState === 1) {
      return await User.findOne({ username })
    } else {
      // ใช้ memory database
      return memoryUsers.find(user => user.username === username)
    }
  } catch (error) {
    console.error('❌ Find user error:', error)
    // Fallback to memory
    return memoryUsers.find(user => user.username === username)
  }
}

const findUserById = async (id) => {
  try {
    if (useMongoDB && mongoose.connection.readyState === 1) {
      return await User.findById(id)
    } else {
      return memoryUsers.find(user => user.id === id)
    }
  } catch (error) {
    console.error('❌ Find user by ID error:', error)
    return memoryUsers.find(user => user.id === id)
  }
}

const updateUserLoginInfo = async (userId, success = true) => {
  try {
    if (useMongoDB && mongoose.connection.readyState === 1) {
      const updateData = success 
        ? { 
            lastLogin: new Date(), 
            loginAttempts: 0, 
            lockUntil: null 
          }
        : { 
            $inc: { loginAttempts: 1 }
          }
      
      const user = await User.findByIdAndUpdate(userId, updateData, { new: true })
      
      if (!success && user && user.loginAttempts >= 5) {
        await User.findByIdAndUpdate(userId, {
          lockUntil: new Date(Date.now() + 30 * 60 * 1000)
        })
      }
      
      return user
    } else {
      // Memory database
      const user = memoryUsers.find(u => u.id === userId)
      if (user) {
        if (success) {
          user.lastLogin = new Date()
          user.loginAttempts = 0
          user.lockUntil = null
        } else {
          user.loginAttempts = (user.loginAttempts || 0) + 1
          if (user.loginAttempts >= 5) {
            user.lockUntil = new Date(Date.now() + 30 * 60 * 1000)
          }
        }
      }
      return user
    }
  } catch (error) {
    console.error('❌ Update user login info error:', error)
    // Fallback to memory
    const user = memoryUsers.find(u => u.id === userId)
    if (user) {
      if (success) {
        user.lastLogin = new Date()
        user.loginAttempts = 0
        user.lockUntil = null
      } else {
        user.loginAttempts = (user.loginAttempts || 0) + 1
        if (user.loginAttempts >= 5) {
          user.lockUntil = new Date(Date.now() + 30 * 60 * 1000)
        }
      }
    }
    return user
  }
}

const isAccountLocked = (user) => {
  return user.lockUntil && user.lockUntil > new Date()
}

const isTokenBlacklisted = async (token) => {
  try {
    if (useMongoDB && mongoose.connection.readyState === 1) {
      const blacklisted = await BlacklistedToken.findOne({ token })
      return !!blacklisted
    } else {
      return memoryBlacklistedTokens.has(token)
    }
  } catch (error) {
    console.error('❌ Check blacklist error:', error)
    return memoryBlacklistedTokens.has(token)
  }
}

const blacklistToken = async (token) => {
  try {
    if (useMongoDB && mongoose.connection.readyState === 1) {
      await BlacklistedToken.create({ token })
    } else {
      memoryBlacklistedTokens.add(token)
    }
  } catch (error) {
    console.error('❌ Blacklist token error:', error)
    memoryBlacklistedTokens.add(token)
  }
}

// Initialize Database
const initializeDatabase = async () => {
  const connection = await connectDB()
  
  if (connection) {
    useMongoDB = true
    console.log('🚀 Using MongoDB database')
    await seedUsers()
  } else {
    useMongoDB = false
    console.log('🔄 Using memory database (fallback)')
  }
}

// Seed initial users (สำหรับ MongoDB)
const seedUsers = async () => {
  try {
    if (!useMongoDB) return
    
    const userCount = await User.countDocuments()
    if (userCount === 0) {
      const bcrypt = require('bcryptjs')
      const saltRounds = 10
      
      const initialUsers = [
        {
          username: 'admin',
          email: 'admin@welovepet.com',
          password: await bcrypt.hash('admin123', saltRounds),
          name: 'ผู้ดูแลระบบ',
          role: 'admin'
        },
        {
          username: 'manager',
          email: 'manager@welovepet.com',
          password: await bcrypt.hash('manager123', saltRounds),
          name: 'ผู้จัดการ',
          role: 'admin'
        },
        {
          username: 'staff',
          email: 'staff@welovepet.com',
          password: await bcrypt.hash('staff123', saltRounds),
          name: 'พนักงาน',
          role: 'staff'
        }
      ]
      
      await User.insertMany(initialUsers)
      console.log('✅ Initial users created in MongoDB')
    }
  } catch (error) {
    console.error('❌ Seed users error:', error)
  }
}

// Export functions
module.exports = {
  initializeDatabase,
  connectDB,
  User,
  BlacklistedToken,
  findUserByUsername,
  findUserById,
  updateUserLoginInfo,
  isAccountLocked,
  isTokenBlacklisted,
  blacklistToken,
  seedUsers,
  // Export สำหรับตรวจสอบ
  isUsingMongoDB: () => useMongoDB
}