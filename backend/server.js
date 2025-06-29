const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

const { connectRedis } = require("./config/redis")
const errorHandler = require("./middleware/errorHandler")
const { APIError } = require("./utils/errors")

// Import routes
const authRoutes = require("./routes/auth")
// Uncomment the route imports
const userRoutes = require("./routes/user")
const productRoutes = require("./routes/products")
const serviceRoutes = require("./routes/services")
const orderRoutes = require("./routes/orders")
const bookingRoutes = require("./routes/bookings")
const articleRoutes = require("./routes/articles")
const adminRoutes = require("./routes/admin")
const webhookRoutes = require("./routes/webhooks")

const app = express()

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000,
  max: Number.parseInt(process.env.RATE_LIMIT_MAX),
  message: "Too many requests from this IP, please try again later.",
})
app.use("/api/", limiter)

// Body parsing middleware
app.use(compression())
app.use(morgan("combined"))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Static files
app.use("/uploads", express.static("uploads"))

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB")
    connectRedis()
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  })

// Routes
app.use("/api/auth", authRoutes)
// Uncomment the route usage
app.use("/api/user", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/services", serviceRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/articles", articleRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/webhooks", webhookRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
})

// 404 handler
app.use("*", (req, res, next) => {
  next(new APIError(`Route ${req.originalUrl} not found`, 404))
})

// Error handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`)
})

// CORS middleware
app.use((req, res, next) => {
  console.log("CORS Middleware:", req.method, req.url);
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    console.log("Preflight OPTIONS request - sending 204");
    return res.sendStatus(204);
  }
  next();
});


module.exports = app
