const express = require("express")
const User = require("../models/User")
const { authenticate } = require("../middleware/auth")
const { userValidation } = require("../middleware/validation")
const { APIError, NotFoundError } = require("../utils/errors")
const { cache } = require("../config/redis")

const router = express.Router()

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", authenticate, async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", authenticate, userValidation.updateProfile, async (req, res, next) => {
  try {
    const { firstName, lastName, phone, dateOfBirth } = req.body

    const user = await User.findById(req.user._id)
    if (!user) {
      return next(new NotFoundError("User"))
    }

    // Update fields
    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    if (phone) user.phone = phone
    if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth)

    await user.save()

    // Clear cache
    await cache.del(`user:${user._id}`)

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/user/addresses
// @desc    Get user addresses
// @access  Private
router.get("/addresses", authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return next(new NotFoundError("User"))
    }

    res.json({
      success: true,
      data: {
        addresses: user.addresses,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/user/addresses
// @desc    Add new address
// @access  Private
router.post("/addresses", authenticate, async (req, res, next) => {
  try {
    const { addressType, addressLine1, addressLine2, district, province, postalCode, country, isDefault } = req.body

    const user = await User.findById(req.user._id)
    if (!user) {
      return next(new NotFoundError("User"))
    }

    // If this is set as default, unset other default addresses
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false
      })
    }

    // Add new address
    user.addresses.push({
      addressType,
      addressLine1,
      addressLine2,
      district,
      province,
      postalCode,
      country: country || "Thailand",
      isDefault: isDefault || user.addresses.length === 0, // First address is default
    })

    await user.save()

    // Clear cache
    await cache.del(`user:${user._id}`)

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: {
        address: user.addresses[user.addresses.length - 1],
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   PUT /api/user/addresses/:addressId
// @desc    Update address
// @access  Private
router.put("/addresses/:addressId", authenticate, async (req, res, next) => {
  try {
    const { addressId } = req.params
    const updateData = req.body

    const user = await User.findById(req.user._id)
    if (!user) {
      return next(new NotFoundError("User"))
    }

    const address = user.addresses.id(addressId)
    if (!address) {
      return next(new NotFoundError("Address"))
    }

    // If setting as default, unset other defaults
    if (updateData.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false
      })
    }

    // Update address
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        address[key] = updateData[key]
      }
    })

    await user.save()

    // Clear cache
    await cache.del(`user:${user._id}`)

    res.json({
      success: true,
      message: "Address updated successfully",
      data: {
        address,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   DELETE /api/user/addresses/:addressId
// @desc    Delete address
// @access  Private
router.delete("/addresses/:addressId", authenticate, async (req, res, next) => {
  try {
    const { addressId } = req.params

    const user = await User.findById(req.user._id)
    if (!user) {
      return next(new NotFoundError("User"))
    }

    const address = user.addresses.id(addressId)
    if (!address) {
      return next(new NotFoundError("Address"))
    }

    // Don't allow deleting the last address
    if (user.addresses.length === 1) {
      return next(new APIError("Cannot delete the last address", 400))
    }

    const wasDefault = address.isDefault
    user.addresses.pull(addressId)

    // If deleted address was default, set first remaining address as default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true
    }

    await user.save()

    // Clear cache
    await cache.del(`user:${user._id}`)

    res.json({
      success: true,
      message: "Address deleted successfully",
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/user/orders
// @desc    Get user orders
// @access  Private
router.get("/orders", authenticate, async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const Order = require("../models/Order")

    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("items.productId", "name images.thumbnail")
      .populate("items.serviceId", "name")

    const total = await Order.countDocuments({ userId: req.user._id })

    res.json({
      success: true,
      data: {
        orders,
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

module.exports = router
