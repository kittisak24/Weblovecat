const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  serviceDetails: {
    durationMinutes: {
      type: Number,
      required: true,
    },
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true,
    },
  },
  description: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

// Pre-save hook เพื่อสร้าง slug อัตโนมัติจาก name
serviceSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("name")) {
    let slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9ก-๙]+/g, "-") // รองรับตัวอักษรไทย
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      || "service"; // ค่าเริ่มต้นถ้า slug ว่าง

    let counter = 1;
    let uniqueSlug = slug;
    while (await this.constructor.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    this.slug = uniqueSlug;
  }
  next();
});

module.exports = mongoose.model("Service", serviceSchema);