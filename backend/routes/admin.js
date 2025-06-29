const express = require("express")
const { authenticate, requireRole } = require("../middleware/auth")
const NotFoundError = require("../utils/errors") // Declare NotFoundError

const router = express.Router()

// All admin routes require authentication
router.use(authenticate)

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private (Manager, System Admin)
router.get("/dashboard", requireRole(["manager", "system_admin"]), async (req, res, next) => {
  try {
    const User = require("../models/User")
    const Product = require("../models/Product")
    const Order = require("../models/Order")
    const ServiceBooking = require("../models/ServiceBooking")

    // Get basic stats
    const [totalUsers, totalProducts, totalOrders, totalBookings] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      Product.countDocuments({ status: "published" }),
      Order.countDocuments(),
      ServiceBooking.countDocuments(),
    ])

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "firstName lastName")
      .select("orderNumber totalAmount status createdAt")

    // Get today's bookings
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayBookings = await ServiceBooking.find({
      bookingDate: { $gte: today, $lt: tomorrow },
    })
      .populate("serviceId", "name")
      .populate("userId", "firstName lastName phone")

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalBookings,
        },
        recentOrders,
        todayBookings,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/admin/users
// @desc    Get all users (System Admin only)
// @access  Private (System Admin)
router.get("/users", requireRole(["system_admin"]), async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const User = require("../models/User")

    const users = await User.find().sort({ createdAt: -1 }).skip(skip).limit(limit).select("-passwordHash")

    const total = await User.countDocuments()

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/admin/products
// @desc    Get all products for admin
// @access  Private (Manager, System Admin)
router.get("/products", requireRole(["manager", "system_admin"]), async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const Product = require("../models/Product")

    // Build query
    const query = {}
    if (req.query.status) {
      query.status = req.query.status
    }
    if (req.query.category) {
      query.categoryId = req.query.category
    }
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
      ]
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("categoryId", "name")

    const total = await Product.countDocuments(query)

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/admin/products
// @desc    Create new product
// @access  Private (Manager, System Admin)
router.post("/products", requireRole(["manager", "system_admin"]), async (req, res, next) => {
  try {
    const Product = require("../models/Product")

    const productData = {
      ...req.body,
    }

    const product = new Product(productData)
    await product.save()

    // Populate category for response
    await product.populate("categoryId", "name")

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        product,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   PUT /api/admin/products/:id
// @desc    Update product
// @access  Private (Manager, System Admin)
router.put("/products/:id", requireRole(["manager", "system_admin"]), async (req, res, next) => {
  try {
    const { id } = req.params
    const Product = require("../models/Product")

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("categoryId", "name")

    if (!product) {
      return next(new NotFoundError("Product"))
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: {
        product,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   DELETE /api/admin/products/:id
// @desc    Delete product
// @access  Private (System Admin)
router.delete("/products/:id", requireRole(["system_admin"]), async (req, res, next) => {
  try {
    const { id } = req.params
    const Product = require("../models/Product")

    const product = await Product.findByIdAndDelete(id)

    if (!product) {
      return next(new NotFoundError("Product"))
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/admin/categories
// @desc    Create product category
// @access  Private (Manager, System Admin)
router.post("/categories", requireRole(["manager", "system_admin"]), async (req, res, next) => {
  try {
    const ProductCategory = require("../models/ProductCategory")

    const category = new ProductCategory(req.body)
    await category.save()

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: {
        category,
      },
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
