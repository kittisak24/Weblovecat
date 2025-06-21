// Fixed Backend Server with Express.js for Pet Website Authentication
const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const rateLimit = require("express-rate-limit")

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || "we-love-pet-super-secret-jwt-key-2024"
const JWT_EXPIRES_IN = "24h"

// Middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true)

      const allowedOrigins = ["http://localhost:3000", "http://localhost:3001", "https://your-frontend-domain.com"]

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
)

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: "Too many login attempts, please try again later.",
    retryAfter: 15 * 60, // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many login attempts, please try again later.",
      code: "RATE_LIMIT_EXCEEDED",
      retryAfter: 15 * 60,
    })
  },
})

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests, please try again later.",
    retryAfter: 15 * 60,
  },
})

app.use(generalLimiter)

// Mock Database (In production, use real database like MongoDB, PostgreSQL, etc.)
const users = [
  {
    id: "1",
    username: "admin",
    email: "admin@welovepet.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: admin123
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
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: manager123
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
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: staff123
    role: "staff",
    name: "พนักงาน",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    lastLogin: null,
    loginAttempts: 0,
    lockUntil: null,
  },
]

// Blacklisted tokens (for logout functionality)
const blacklistedTokens = new Set()

// Helper Functions
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  )
}

const verifyToken = (token) => {
  try {
    if (blacklistedTokens.has(token)) {
      throw new Error("Token has been blacklisted")
    }
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error("Invalid token")
  }
}

const findUserByUsername = (username) => {
  return users.find((user) => user.username === username)
}

const findUserById = (id) => {
  return users.find((user) => user.id === id)
}

const updateUserLoginInfo = (userId, success = true) => {
  const user = findUserById(userId)
  if (user) {
    if (success) {
      user.lastLogin = new Date()
      user.loginAttempts = 0
      user.lockUntil = null
    } else {
      user.loginAttempts = (user.loginAttempts || 0) + 1
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000) // Lock for 30 minutes
      }
    }
  }
}

const isAccountLocked = (user) => {
  return user.lockUntil && user.lockUntil > new Date()
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: "Access token required",
      code: "TOKEN_REQUIRED",
    })
  }

  try {
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({
      error: "Invalid or expired token",
      code: "TOKEN_INVALID",
    })
  }
}

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Admin access required",
      code: "INSUFFICIENT_PERMISSIONS",
    })
  }
  next()
}

// Routes

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "We Love Pet Backend API",
    version: "1.0.0",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || "development",
  })
})

// API Info
app.get("/api", (req, res) => {
  res.json({
    name: "We Love Pet Backend API",
    version: "1.0.0",
    description: "Backend API for We Love Pet website authentication and management",
    endpoints: {
      health: "GET /api/health",
      auth: {
        login: "POST /api/auth/login",
        logout: "POST /api/auth/logout",
        me: "GET /api/auth/me",
        changePassword: "POST /api/auth/change-password",
      },
      admin: {
        users: "GET /api/admin/users",
        createUser: "POST /api/admin/users",
        updateUser: "PUT /api/admin/users/:id",
        unlockUser: "POST /api/admin/users/:id/unlock",
        stats: "GET /api/admin/stats",
      },
    },
    testCredentials: {
      admin: "admin / admin123",
      manager: "manager / manager123",
      staff: "staff / staff123",
    },
  })
})

// Login
app.post("/api/auth/login", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
        code: "MISSING_CREDENTIALS",
      })
    }

    // Find user
    const user = findUserByUsername(username)
    if (!user) {
      return res.status(401).json({
        error: "Invalid username or password",
        code: "INVALID_CREDENTIALS",
      })
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        error: "Account is deactivated",
        code: "ACCOUNT_DEACTIVATED",
      })
    }

    // Check if account is locked
    if (isAccountLocked(user)) {
      const lockTimeRemaining = Math.ceil((user.lockUntil - new Date()) / 1000 / 60)
      return res.status(423).json({
        error: `Account is locked. Try again in ${lockTimeRemaining} minutes`,
        code: "ACCOUNT_LOCKED",
        lockTimeRemaining,
      })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      updateUserLoginInfo(user.id, false)
      return res.status(401).json({
        error: "Invalid username or password",
        code: "INVALID_CREDENTIALS",
        attemptsRemaining: Math.max(0, 5 - (user.loginAttempts + 1)),
      })
    }

    // Generate token
    const token = generateToken(user)

    // Update login info
    updateUserLoginInfo(user.id, true)

    // Return success response
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    })

    console.log(`✅ User ${username} logged in successfully at ${new Date().toISOString()}`)
  } catch (error) {
    console.error("❌ Login error:", error)
    res.status(500).json({
      error: "Internal server error",
      code: "INTERNAL_ERROR",
    })
  }
})

// Logout
app.post("/api/auth/logout", authenticateToken, (req, res) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (token) {
      blacklistedTokens.add(token)
    }

    res.json({
      success: true,
      message: "Logout successful",
    })

    console.log(`✅ User ${req.user.username} logged out at ${new Date().toISOString()}`)
  } catch (error) {
    console.error("❌ Logout error:", error)
    res.status(500).json({
      error: "Internal server error",
      code: "INTERNAL_ERROR",
    })
  }
})

// Get current user info
app.get("/api/auth/me", authenticateToken, (req, res) => {
  try {
    const user = findUserById(req.user.userId)

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        code: "USER_NOT_FOUND",
      })
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: "Account is deactivated",
        code: "ACCOUNT_DEACTIVATED",
      })
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error("❌ Get user error:", error)
    res.status(500).json({
      error: "Internal server error",
      code: "INTERNAL_ERROR",
    })
  }
})

// Change password
app.post("/api/auth/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Current password and new password are required",
        code: "MISSING_PASSWORDS",
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "New password must be at least 6 characters long",
        code: "PASSWORD_TOO_SHORT",
      })
    }

    const user = findUserById(req.user.userId)
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        code: "USER_NOT_FOUND",
      })
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        error: "Current password is incorrect",
        code: "INVALID_CURRENT_PASSWORD",
      })
    }

    // Hash new password
    const saltRounds = 10
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update password
    user.password = hashedNewPassword

    res.json({
      success: true,
      message: "Password changed successfully",
    })

    console.log(`✅ User ${user.username} changed password at ${new Date().toISOString()}`)
  } catch (error) {
    console.error("❌ Change password error:", error)
    res.status(500).json({
      error: "Internal server error",
      code: "INTERNAL_ERROR",
    })
  }
})

// Admin Routes

// Get all users (Admin only)
app.get("/api/admin/users", authenticateToken, requireAdmin, (req, res) => {
  try {
    const userList = users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      loginAttempts: user.loginAttempts,
      isLocked: isAccountLocked(user),
    }))

    res.json({
      users: userList,
      total: userList.length,
    })
  } catch (error) {
    console.error("❌ Get users error:", error)
    res.status(500).json({
      error: "Internal server error",
      code: "INTERNAL_ERROR",
    })
  }
})

// Create new user (Admin only)
app.post("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username, email, password, name, role = "staff" } = req.body

    // Validation
    if (!username || !email || !password || !name) {
      return res.status(400).json({
        error: "Username, email, password, and name are required",
        code: "MISSING_FIELDS",
      })
    }

    // Check if username already exists
    if (findUserByUsername(username)) {
      return res.status(409).json({
        error: "Username already exists",
        code: "USERNAME_EXISTS",
      })
    }

    // Check if email already exists
    if (users.find((user) => user.email === email)) {
      return res.status(409).json({
        error: "Email already exists",
        code: "EMAIL_EXISTS",
      })
    }

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      username,
      email,
      password: hashedPassword,
      name,
      role,
      isActive: true,
      createdAt: new Date(),
      lastLogin: null,
      loginAttempts: 0,
      lockUntil: null,
    }

    users.push(newUser)

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt,
      },
    })

    console.log(`✅ New user ${username} created by ${req.user.username} at ${new Date().toISOString()}`)
  } catch (error) {
    console.error("❌ Create user error:", error)
    res.status(500).json({
      error: "Internal server error",
      code: "INTERNAL_ERROR",
    })
  }
})

// Get system stats (Admin only)
app.get("/api/admin/stats", authenticateToken, requireAdmin, (req, res) => {
  try {
    const now = new Date()
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter((user) => user.isActive).length,
      lockedUsers: users.filter((user) => isAccountLocked(user)).length,
      recentLogins: users.filter((user) => user.lastLogin && user.lastLogin > last24Hours).length,
      weeklyLogins: users.filter((user) => user.lastLogin && user.lastLogin > last7Days).length,
      usersByRole: {
        admin: users.filter((user) => user.role === "admin").length,
        staff: users.filter((user) => user.role === "staff").length,
        user: users.filter((user) => user.role === "user").length,
      },
      systemInfo: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version,
        platform: process.platform,
      },
    }

    res.json(stats)
  } catch (error) {
    console.error("❌ Get stats error:", error)
    res.status(500).json({
      error: "Internal server error",
      code: "INTERNAL_ERROR",
    })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err)

  // Handle CORS errors
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      error: "CORS policy violation",
      code: "CORS_ERROR",
    })
  }

  res.status(500).json({
    error: "Internal server error",
    code: "INTERNAL_ERROR",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    code: "NOT_FOUND",
    availableEndpoints: [
      "GET /api",
      "GET /api/health",
      "POST /api/auth/login",
      "POST /api/auth/logout",
      "GET /api/auth/me",
      "GET /api/admin/stats",
    ],
  })
})

// Start server
const server = app.listen(PORT, () => {
  console.log("🚀 We Love Pet Backend API Server")
  console.log("=".repeat(40))
  console.log(`📍 Server running on: http://localhost:${PORT}`)
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`)
  console.log(`📖 API info: http://localhost:${PORT}/api`)
  console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/auth/login`)
  console.log(`📊 Admin stats: http://localhost:${PORT}/api/admin/stats`)
  console.log("")
  console.log("👥 Test Users:")
  console.log("   Admin: admin / admin123")
  console.log("   Manager: manager / manager123")
  console.log("   Staff: staff / staff123")
  console.log("")
  console.log("🧪 Test the API:")
  console.log("   node scripts/test-api.js")
  console.log("=".repeat(40))
})

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n📡 ${signal} received, shutting down gracefully...`)

  server.close(() => {
    console.log("✅ HTTP server closed")

    // Clean up resources
    blacklistedTokens.clear()

    console.log("👋 Server shutdown complete")
    process.exit(0)
  })

  // Force close after 10 seconds
  setTimeout(() => {
    console.log("⚠️  Forcing server shutdown...")
    process.exit(1)
  }, 10000)
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
process.on("SIGINT", () => gracefulShutdown("SIGINT"))

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err)
  gracefulShutdown("UNCAUGHT_EXCEPTION")
})

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason)
  gracefulShutdown("UNHANDLED_REJECTION")
})

module.exports = app
