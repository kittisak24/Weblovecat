const mongoose = require("mongoose")
const slugify = require("slugify")

const articleSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArticleCategory",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    excerpt: String,
    content: {
      type: String,
      required: true,
    },
    featuredImage: String,
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    seoTitle: String,
    seoDescription: String,
    publishedAt: Date,
  },
  {
    timestamps: true,
  },
)

// Generate slug before saving
articleSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  next()
})

module.exports = mongoose.model("Article", articleSchema)
