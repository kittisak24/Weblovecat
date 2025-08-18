const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { APIError } = require("../utils/errors")
const { cache } = require("../config/redis")

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return next(new APIError("Access denied. No token provided.", 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check cache first
    let user = await cache.get(`user:${decoded.id}`)

    if (!user) {
      user = await User.findById(decoded.id).select("-passwordHash")
      if (!user) {
        return next(new APIError("Invalid token.", 401))
      }

      // Cache user for 15 minutes
      await cache.set(`user:${decoded.id}`, user, 900)
    }

    if (!user.isActive) {
      return next(new APIError("Account is deactivated.", 401))
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new APIError("Invalid token.", 401))
    }
    if (error.name === "TokenExpiredError") {
      return next(new APIError("Token expired.", 401))
    }
    next(error)
  }
}

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new APIError("Authentication required.", 401))
    }

    if (!roles.includes(req.user.role)) {
      return next(new APIError("Insufficient permissions.", 403))
    }

    next()
  }
}

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id).select("-passwordHash")

      if (user && user.isActive) {
        req.user = user
      }
    }

    next()
  } catch (error) {
    // Continue without authentication for optional auth
    next()
  }
}

module.exports = {
  authenticate,
  requireAuth: authenticate,  
  requireRole,
  optionalAuth,
}
