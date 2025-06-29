const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    min: 0,
    default: 0
  },
  image: {
    type: String,
    default: "/placeholder.svg?height=300&width=300"
  },
  category: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    min: 0,
    default: 0
  },
  badge: {
    type: String,
    enum: ['ขายดี', 'ใหม่', 'ลดราคา', 'แนะนำ', '']
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  _id: false
});

// สร้าง index สำหรับการค้นหา
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;