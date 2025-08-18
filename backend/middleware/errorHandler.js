const { APIError } = require("../utils/errors")

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log error
  console.error(err)

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found"
    error = new APIError(message, 404)
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    const message = `${field} already exists`
    error = new APIError(message, 400)
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ")
    error = new APIError(message, 400)
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token"
    error = new APIError(message, 401)
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired"
    error = new APIError(message, 401)
  }

  // Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    const message = "File too large"
    error = new APIError(message, 400)
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    const message = "Too many files"
    error = new APIError(message, 400)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message || "Server Error",
      ...(error.errorCode && { code: error.errorCode }),
      ...(error.errors && { details: error.errors }),
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  })
}

module.exports = errorHandler
