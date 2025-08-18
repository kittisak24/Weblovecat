const express = require("express")
const { queryValidation } = require("../middleware/validation")
const { NotFoundError } = require("../utils/errors")
const { cache } = require("../config/redis")

const router = express.Router()

// @route   GET /api/articles
// @desc    Get all articles
// @access  Public
router.get("/", queryValidation.pagination, queryValidation.search, async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Build query
    const query = { status: "published" }

    // Search
    if (req.query.q) {
      query.$or = [
        { title: { $regex: req.query.q, $options: "i" } },
        { excerpt: { $regex: req.query.q, $options: "i" } },
        { content: { $regex: req.query.q, $options: "i" } },
      ]
    }

    // Category filter
    if (req.query.category) {
      query.categoryId = req.query.category
    }

    // Check cache
    const cacheKey = `articles:${JSON.stringify({ query, page, limit })}`
    const cachedResult = await cache.get(cacheKey)

    if (cachedResult) {
      return res.json({
        success: true,
        data: cachedResult,
        cached: true,
      })
    }

    const Article = require("../models/Article")

    const articles = await Article.find(query)
      .sort({ isFeatured: -1, publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("categoryId", "name slug")
      .populate("authorId", "firstName lastName")
      .select("-content") // Exclude full content for list view

    const total = await Article.countDocuments(query)

    const result = {
      articles,
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

// @route   GET /api/articles/featured
// @desc    Get featured articles
// @access  Public
router.get("/featured", async (req, res, next) => {
  try {
    const limit = Number.parseInt(req.query.limit) || 5

    // Check cache
    const cacheKey = `articles:featured:${limit}`
    let articles = await cache.get(cacheKey)

    if (!articles) {
      const Article = require("../models/Article")
      articles = await Article.find({
        status: "published",
        isFeatured: true,
      })
        .sort({ publishedAt: -1 })
        .limit(limit)
        .populate("categoryId", "name slug")
        .populate("authorId", "firstName lastName")
        .select("-content")

      // Cache for 1 hour
      await cache.set(cacheKey, articles, 3600)
    }

    res.json({
      success: true,
      data: {
        articles,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/articles/:slug
// @desc    Get single article by slug
// @access  Public
router.get("/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params

    // Check cache
    const cacheKey = `article:${slug}`
    let article = await cache.get(cacheKey)

    if (!article) {
      const Article = require("../models/Article")
      article = await Article.findOne({ slug, status: "published" })
        .populate("categoryId", "name slug")
        .populate("authorId", "firstName lastName profileImage")

      if (!article) {
        return next(new NotFoundError("Article"))
      }

      // Cache for 30 minutes
      await cache.set(cacheKey, article, 1800)
    }

    // Increment view count (don't wait for it)
    const Article = require("../models/Article")
    Article.findByIdAndUpdate(article._id, { $inc: { viewCount: 1 } }).exec()

    res.json({
      success: true,
      data: {
        article,
      },
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
