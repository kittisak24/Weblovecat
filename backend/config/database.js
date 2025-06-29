const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)

    // Create indexes
    await createIndexes()
  } catch (error) {
    console.error("Database connection error:", error)
    process.exit(1)
  }
}

const createIndexes = async () => {
  try {
    const User = require("../models/User")
    const Product = require("../models/Product")
    const Service = require("../models/Service")
    const Order = require("../models/Order")

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true })
    await User.collection.createIndex({ role: 1 })
    await User.collection.createIndex({ isActive: 1 })

    // Product indexes
    await Product.collection.createIndex({ categoryId: 1, status: 1 })
    await Product.collection.createIndex({ isFeatured: 1, status: 1 })
    await Product.collection.createIndex({ "pricing.salePrice": 1 })
    await Product.collection.createIndex({ tags: 1 })

    // Service indexes
    await Service.collection.createIndex({ slug: 1 }, { unique: true })
    await Service.collection.createIndex({ categoryId: 1, status: 1 })
    await Service.collection.createIndex({ isFeatured: 1, status: 1 })

    // Order indexes
    await Order.collection.createIndex({ orderNumber: 1 }, { unique: true })
    await Order.collection.createIndex({ userId: 1 })
    await Order.collection.createIndex({ status: 1 })
    await Order.collection.createIndex({ createdAt: -1 })

    console.log("Database indexes created successfully")
  } catch (error) {
    console.error("Error creating indexes:", error)
  }
}

module.exports = connectDB
