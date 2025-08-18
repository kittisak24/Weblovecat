const express = require("express")
const { optionalAuth } = require("../middleware/auth")
const { queryValidation } = require("../middleware/validation")
const { NotFoundError, APIError } = require("../utils/errors")
const { cache } = require("../config/redis")

const router = express.Router()

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get("/", queryValidation.pagination, async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 12
    const skip = (page - 1) * limit

    // Build query
    const query = { status: "published" }

    // Category filter
    if (req.query.category) {
      query.categoryId = req.query.category
    }

    // Home service filter
    if (req.query.homeService === "true") {
      query["serviceOptions.isHomeService"] = true
    }

    // Pet type filter
    if (req.query.petType) {
      query["serviceDetails.petTypes"] = req.query.petType
    }

    // Check cache
    const cacheKey = `services:${JSON.stringify({ query, page, limit })}`
    const cachedResult = await cache.get(cacheKey)

    if (cachedResult) {
      return res.json({
        success: true,
        data: cachedResult,
        cached: true,
      })
    }

    const Service = require("../models/Service")

    const services = await Service.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("categoryId", "name slug icon")
      .select("-__v")

    const total = await Service.countDocuments(query)

    const result = {
      services,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }

    // Cache for 30 minutes
    await cache.set(cacheKey, result, 1800)

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/services/categories
// @desc    Get service categories
// @access  Public
router.get("/categories", async (req, res, next) => {
  try {
    // Check cache
    const cacheKey = "service-categories"
    let categories = await cache.get(cacheKey)

    if (!categories) {
      const ServiceCategory = require("../models/ServiceCategory")
      categories = await ServiceCategory.find({ isActive: true }).sort({ sortOrder: 1, name: 1 })

      // Cache for 6 hours
      await cache.set(cacheKey, categories, 21600)
    }

    res.json({
      success: true,
      data: {
        categories,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/services/featured
// @desc    Get featured services
// @access  Public
router.get("/featured", async (req, res, next) => {
  try {
    const limit = Number.parseInt(req.query.limit) || 6

    // Check cache
    const cacheKey = `services:featured:${limit}`
    let services = await cache.get(cacheKey)

    if (!services) {
      const Service = require("../models/Service")
      services = await Service.find({
        status: "published",
        isFeatured: true,
      })
        .sort({ "stats.bookingCount": -1 })
        .limit(limit)
        .populate("categoryId", "name slug icon")
        .select("-__v")

      // Cache for 2 hours
      await cache.set(cacheKey, services, 7200)
    }

    res.json({
      success: true,
      data: {
        services,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/services/:slug
// @desc    Get single service by slug
// @access  Public
router.get("/:slug", optionalAuth, async (req, res, next) => {
  try {
    const { slug } = req.params

    // Check cache
    const cacheKey = `service:${slug}`
    let service = await cache.get(cacheKey)

    if (!service) {
      const Service = require("../models/Service")
      service = await Service.findOne({ slug, status: "published" })
        .populate("categoryId", "name slug icon")
        .select("-__v")

      if (!service) {
        return next(new NotFoundError("Service"))
      }

      // Cache for 30 minutes
      await cache.set(cacheKey, service, 1800)
    }

    res.json({
      success: true,
      data: {
        service,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/services/:id/available-slots
// @desc    Get available time slots for a service
// @access  Public
router.get("/:id/available-slots", async (req, res, next) => {
  try {
    const { id } = req.params
    const { date } = req.query

    if (!date) {
      return next(new APIError("Date is required", 400))
    }

    const Service = require("../models/Service")
    const ServiceBooking = require("../models/ServiceBooking")

    const service = await Service.findById(id)
    if (!service) {
      return next(new NotFoundError("Service"))
    }

    const requestedDate = new Date(date)
    const dayOfWeek = requestedDate.getDay()

    // Get service availability for the day
    const dayAvailability = service.availability.timeSlots.filter(
      (slot) => slot.dayOfWeek === dayOfWeek && slot.isActive,
    )

    if (dayAvailability.length === 0) {
      return res.json({
        success: true,
        data: {
          availableSlots: [],
          message: "No availability for this day",
        },
      })
    }

    // Get existing bookings for the date
    const existingBookings = await ServiceBooking.find({
      serviceId: id,
      bookingDate: requestedDate,
      status: { $in: ["pending", "confirmed", "in_progress"] },
    })

    // Generate available slots
    const availableSlots = []

    for (const slot of dayAvailability) {
      const startTime = slot.startTime
      const endTime = slot.endTime
      const maxBookings = slot.maxBookings

      // Count existing bookings for this time slot
      const bookingsCount = existingBookings.filter((booking) => booking.startTime === startTime).length

      if (bookingsCount < maxBookings) {
        availableSlots.push({
          startTime,
          endTime,
          availableSpots: maxBookings - bookingsCount,
          maxBookings,
        })
      }
    }

    res.json({
      success: true,
      data: {
        date: requestedDate,
        availableSlots,
      },
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
