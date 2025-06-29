const express = require("express")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const User = require("../models/User")
const { userValidation } = require("../middleware/validation")
const { APIError } = require("../utils/errors")
//const { sendEmail } = require("../utils/email")
const { cache } = require("../config/redis")

const router = express.Router()

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })

  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  })

  return { accessToken, refreshToken }
}

// @route   POST /api/auth/check-username
// @desc    Check if username is available
// @access  Public
router.post("/check-username", userValidation.checkUsername, async (req, res, next) => {
  try {
    const { username } = req.body

    const existingUser = await User.findOne({ username })

    res.json({
      success: true,
      data: {
        username,
        available: !existingUser,
        message: existingUser ? "Username is already taken" : "Username is available",
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", userValidation.register, async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName, phone } = req.body

    // Check if username already exists
    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return next(new APIError("Username is already taken", 400))
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return next(new APIError("Email is already registered", 400))
    }

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex")
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user
    const user = new User({
      username,
      email,
      passwordHash: password, // Will be hashed by pre-save middleware
      firstName,
      lastName,
      phone,
      emailVerificationToken,
      emailVerificationExpires,
    })

    await user.save()

    // // Send verification email
    // const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`
    // await sendEmail({
    //   to: email,
    //   subject: "Verify Your Email - Web Love cat",
    //   template: "email-verification",
    //   data: {
    //     firstName,
    //     verificationUrl,
    //   },
    // })

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id)

    // Cache user
    await cache.set(`user:${user._id}`, user, 900)

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please check your email to verify your account.",
      data: {
        user,
        accessToken,
        refreshToken,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/auth/login
// @desc    Login user with username
// @access  Public
router.post("/login", userValidation.login, async (req, res, next) => {
  try {
    const { username, password } = req.body

    // Find user by username and include password for comparison
    const user = await User.findOne({ username }).select("+passwordHash")
    if (!user) {
      return next(new APIError("Invalid username or password", 401))
    }

    // Check if account is active
    if (!user.isActive) {
      return next(new APIError("Account is deactivated", 401))
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return next(new APIError("Invalid username or password", 401))
    }

    // Update login stats
    user.lastLoginAt = new Date()
    user.loginCount += 1
    await user.save()

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id)

    // Cache user (without password)
    const userForCache = user.toJSON()
    await cache.set(`user:${user._id}`, userForCache, 900)

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: userForCache,
        accessToken,
        refreshToken,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return next(new APIError("Refresh token is required", 400))
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    // Find user
    const user = await User.findById(decoded.id)
    if (!user || !user.isActive) {
      return next(new APIError("Invalid refresh token", 401))
    }

    // Generate new tokens
    const tokens = generateTokens(user._id)

    res.json({
      success: true,
      data: tokens,
    })
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new APIError("Invalid refresh token", 401))
    }
    next(error)
  }
})

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email (ใช้ email หรือ username ได้)
// @access  Public
router.post("/forgot-password", async (req, res, next) => {
  try {
    const { identifier } = req.body // identifier อาจเป็น email หรือ username

    if (!identifier) {
      return next(new APIError("Email or username is required", 400))
    }

    // หาผู้ใช้จาก email หรือ username
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }],
    })

    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message: "If an account with that email or username exists, we have sent a password reset link.",
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    user.passwordResetToken = resetToken
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    await user.save()

    // Send reset email
    // const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
    // await sendEmail({
    //   to: user.email,
    //   subject: "Password Reset - Web Love cat",
    //   template: "password-reset",
    //   data: {
    //     firstName: user.firstName,
    //     username: user.username,
    //     resetUrl,
    //   },
    // })

    res.json({
      success: true,
      message: "If an account with that email or username exists, we have sent a password reset link.",
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post("/reset-password", async (req, res, next) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return next(new APIError("Token and password are required", 400))
    }

    // Validate password strength
    if (password.length < 8 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return next(
        new APIError(
          "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number",
          400,
        ),
      )
    }

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    })

    if (!user) {
      return next(new APIError("Invalid or expired reset token", 400))
    }

    // Update password
    user.passwordHash = password // Will be hashed by pre-save middleware
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    // Clear user cache
    await cache.del(`user:${user._id}`)

    res.json({
      success: true,
      message: "Password reset successful",
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/auth/verify-email
// @desc    Verify email address
// @access  Public
router.post("/verify-email", async (req, res, next) => {
  try {
    const { token } = req.body

    if (!token) {
      return next(new APIError("Verification token is required", 400))
    }

    // Find user with valid verification token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    })

    if (!user) {
      return next(new APIError("Invalid or expired verification token", 400))
    }

    // Update user
    user.emailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    await user.save()

    // Clear user cache
    await cache.del(`user:${user._id}`)

    res.json({
      success: true,
      message: "Email verified successfully",
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/auth/logout
// @desc    Logout user (clear cache)
// @access  Private
router.post("/logout", async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        await cache.del(`user:${decoded.id}`)
      } catch (error) {
        // Token might be invalid, but that's okay for logout
      }
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/auth/admin/login
// @desc    Admin login with username
// @access  Public
router.post("/admin/login", userValidation.login, async (req, res, next) => {
  try {
    const { username, password } = req.body

    // Find admin user by username
    const user = await User.findOne({
      username,
      role: { $in: ["manager", "system_admin"] },
    }).select("+passwordHash")

    if (!user) {
      return next(new APIError("Invalid admin credentials", 401))
    }

    // Check if account is active
    if (!user.isActive) {
      return next(new APIError("Admin account is deactivated", 401))
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return next(new APIError("Invalid admin credentials", 401))
    }

    // Update login stats
    user.lastLoginAt = new Date()
    user.loginCount += 1
    await user.save()

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id)

    // Cache user (without password)
    const userForCache = user.toJSON()
    await cache.set(`user:${user._id}`, userForCache, 900)

    res.json({
      success: true,
      message: "Admin login successful",
      data: {
        user: userForCache,
        accessToken,
        refreshToken,
      },
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
