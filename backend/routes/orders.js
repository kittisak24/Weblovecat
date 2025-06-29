const express = require("express")
const Order = require("../models/Order")
const Product = require("../models/Product")
const { authenticate } = require("../middleware/auth")
const { orderValidation } = require("../middleware/validation")
const { APIError, NotFoundError } = require("../utils/errors")

const router = express.Router()

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post("/", authenticate, orderValidation.create, async (req, res, next) => {
  try {
    const { items, addresses, notes, paymentMethod } = req.body

    // Validate and calculate order totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      if (item.type === "product") {
        const product = await Product.findById(item.productId)
        if (!product) {
          return next(new APIError(`Product with ID ${item.productId} not found`, 400))
        }

        if (!product.isInStock(item.quantity)) {
          return next(new APIError(`Insufficient stock for product: ${product.name}`, 400))
        }

        const unitPrice = product.currentPrice
        const totalPrice = unitPrice * item.quantity

        orderItems.push({
          type: "product",
          productId: product._id,
          quantity: item.quantity,
          unitPrice,
          totalPrice,
          itemSnapshot: {
            name: product.name,
            description: product.shortDescription,
            image: product.images.thumbnail,
            attributes: product.attributes,
          },
        })

        subtotal += totalPrice
      }
      // Add service handling here if needed
    }

    // Calculate totals (simplified - you can add tax and shipping logic)
    const taxAmount = 0 // Calculate based on your tax rules
    const shippingAmount = 0 // Calculate based on shipping rules
    const discountAmount = 0 // Apply discounts if any
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount

    // Create order
    const order = new Order({
      userId: req.user._id,
      orderType: "product", // Determine based on items
      items: orderItems,
      addresses,
      pricing: {
        subtotal,
        taxAmount,
        shippingAmount,
        discountAmount,
        totalAmount,
      },
      payment: {
        method: paymentMethod,
      },
      notes: {
        customer: notes,
      },
    })

    await order.save()

    // Update product stock
    for (const item of orderItems) {
      if (item.type === "product") {
        const product = await Product.findById(item.productId)
        product.updateStock(item.quantity, "subtract")
        product.stats.salesCount += item.quantity
        await product.save()
      }
    }

    // Add initial status to history
    order.changeStatus("pending", req.user._id, "Order created")
    await order.save()

    // Populate order for response
    await order.populate("items.productId", "name images.thumbnail")

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        order,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params

    const order = await Order.findById(id)
      .populate("items.productId", "name images.thumbnail")
      .populate("items.serviceId", "name")
      .populate("statusHistory.changedBy", "firstName lastName")

    if (!order) {
      return next(new NotFoundError("Order"))
    }

    // Check if user owns this order or is admin
    if (order.userId.toString() !== req.user._id.toString() && !["manager", "system_admin"].includes(req.user.role)) {
      return next(new APIError("Access denied", 403))
    }

    res.json({
      success: true,
      data: {
        order,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put("/:id/cancel", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params
    const { reason } = req.body

    const order = await Order.findById(id)
    if (!order) {
      return next(new NotFoundError("Order"))
    }

    // Check if user owns this order
    if (order.userId.toString() !== req.user._id.toString()) {
      return next(new APIError("Access denied", 403))
    }

    // Check if order can be cancelled
    if (!["pending", "confirmed"].includes(order.status)) {
      return next(new APIError("Order cannot be cancelled at this stage", 400))
    }

    // Update order status
    order.changeStatus("cancelled", req.user._id, reason || "Cancelled by customer")
    await order.save()

    // Restore product stock
    for (const item of order.items) {
      if (item.type === "product") {
        const product = await Product.findById(item.productId)
        if (product) {
          product.updateStock(item.quantity, "add")
          product.stats.salesCount = Math.max(0, product.stats.salesCount - item.quantity)
          await product.save()
        }
      }
    }

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: {
        order,
      },
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
