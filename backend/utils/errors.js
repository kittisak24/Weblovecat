class APIError extends Error {
  constructor(message, statusCode = 500, errorCode = null) {
    super(message)
    this.name = "APIError"
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

class ValidationError extends APIError {
  constructor(message, errors = []) {
    super(message, 400, "VALIDATION_ERROR")
    this.name = "ValidationError"
    this.errors = errors
  }
}

class NotFoundError extends APIError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND")
    this.name = "NotFoundError"
  }
}

class UnauthorizedError extends APIError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED")
    this.name = "UnauthorizedError"
  }
}

class ForbiddenError extends APIError {
  constructor(message = "Forbidden") {
    super(message, 403, "FORBIDDEN")
    this.name = "ForbiddenError"
  }
}

class ConflictError extends APIError {
  constructor(message = "Conflict") {
    super(message, 409, "CONFLICT")
    this.name = "ConflictError"
  }
}

module.exports = {
  APIError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
}
