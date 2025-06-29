const express = require("express")
const { authenticate } = require("../middleware/auth")
const { APIError, NotFoundError } = require("../utils/errors")

const router = express.Router()

// @route   POST /api/bookings
// @desc    Create new service booking
// @access  Private
router.post("/", async (req, res, next) => {
  try {
    const { serviceId, bookingDate, startTime, endTime, petDetails, serviceLocation, address, customerNotes } = req.body

    // Validate required fields
    if (!serviceId || !bookingDate || !startTime || !endTime || !petDetails?.name) {
      return next(new APIError("Missing required fields", 400))
    }

    const Service = require("../models/Service")
    const ServiceBooking = require("../models/ServiceBooking")

    // Validate service
    const service = await Service.findById(serviceId)
    if (!service) {
      return next(new NotFoundError("Service"))
    }

    // Check if time slot is available
    const existingBooking = await ServiceBooking.findOne({
      serviceId,
      bookingDate: new Date(bookingDate),
      startTime,
      status: { $in: ["pending", "confirmed", "in_progress"] },
    })

    if (existingBooking) {
      return next(new APIError("Time slot is not available", 400))
    }

    // Calculate amount from service pricing
    const amount = service.pricing?.basePrice || 0;

    // Create booking
    const booking = new ServiceBooking({
      serviceId,
      userId: req.user._id || null,
      bookingDate: new Date(bookingDate),
      startTime,
      endTime,
      amount, // เพิ่ม amount
      petDetails,
      serviceLocation: serviceLocation || "clinic",
      address: serviceLocation === "home" ? address : undefined,
      customerNotes,
    })

    await booking.save()

    // Populate booking for response
    await booking.populate("serviceId", "name pricing")

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        booking,
      },
    })
  } catch (error) {
    next(error)
  }
})

// เพิ่ม route สำหรับดู booking list
// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get("/", authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = "", status } = req.query
    const ServiceBooking = require("../models/ServiceBooking")

    const query = { userId: req.user._id }
    if (status) query.status = status

    const bookings = await ServiceBooking.find(query)
      .populate("serviceId", "name pricing")
      .sort({ bookingDate: -1, startTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await ServiceBooking.countDocuments(query)

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      },
    })
  } catch (error) {
    next(error)
  }
})
// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.put("/:id/cancel", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params
    const { reason } = req.body

    const ServiceBooking = require("../models/ServiceBooking")

    const booking = await ServiceBooking.findById(id)
    if (!booking) {
      return next(new NotFoundError("Booking"))
    }

    // Check if user owns this booking
    if (booking.userId.toString() !== req.user._id.toString()) {
      return next(new APIError("Access denied", 403))
    }

    // Check if booking can be cancelled
    if (!["pending", "confirmed"].includes(booking.status)) {
      return next(new APIError("Booking cannot be cancelled at this stage", 400))
    }

    // Update booking status
    booking.status = "cancelled"
    booking.cancellation = {
      cancelledBy: req.user._id,
      cancelledAt: new Date(),
      reason: reason || "Cancelled by customer",
    }

    await booking.save()

    res.json({
      success: true,
      message: "Booking cancelled successfully",
      data: {
        booking,
      },
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
