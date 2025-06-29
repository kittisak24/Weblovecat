const mongoose = require("mongoose")
const slugify = require("slugify")

const serviceCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: String,
    icon: String,
    color: String,
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Generate slug before saving
serviceCategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }
  next()
})

module.exports = mongoose.model("ServiceCategory", serviceCategorySchema)
