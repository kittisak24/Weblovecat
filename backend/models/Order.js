const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["product", "service"],
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  itemSnapshot: {
    name: String,
    description: String,
    image: String,
    attributes: mongoose.Schema.Types.Mixed,
  },
})

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  changedAt: {
    type: Date,
    default: Date.now,
  },
  reason: String,
  notes: String,
})

const refundSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    reason: {
      type: String,
      required: true,
    },
    refundId: String,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    processedAt: Date,
    status: {
      type: String,
      enum: ["pending", "processed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true },
)

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderType: {
      type: String,
      enum: ["product", "service", "mixed"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
    },
    payment: {
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded", "partial"],
        default: "pending",
      },
      method: String,
      paymentId: String,
      paidAt: Date,
      paymentDetails: {
        gatewayResponse: mongoose.Schema.Types.Mixed,
        receiptUrl: String,
      },
    },
    pricing: {
      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },
      taxAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      shippingAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      discountAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: "THB",
      },
    },
    items: [orderItemSchema],
    addresses: {
      shipping: {
        firstName: String,
        lastName: String,
        phone: String,
        email: String,
        addressLine1: String,
        addressLine2: String,
        district: String,
        province: String,
        postalCode: String,
        country: String,
      },
      billing: {
        firstName: String,
        lastName: String,
        phone: String,
        email: String,
        addressLine1: String,
        addressLine2: String,
        district: String,
        province: String,
        postalCode: String,
        country: String,
      },
    },
    shipping: {
      method: String,
      trackingNumber: String,
      carrier: String,
      estimatedDelivery: Date,
      actualDelivery: Date,
      shippingFee: Number,
    },
    discounts: [
      {
        code: String,
        type: String,
        value: Number,
        description: String,
        appliedAmount: Number,
      },
    ],
    notes: {
      customer: String,
      admin: String,
      internal: String,
    },
    statusHistory: [statusHistorySchema],
    refunds: [refundSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const count = await this.constructor.countDocuments()
    this.orderNumber = `WLP${String(count + 1).padStart(6, "0")}`
  }
  next()
})

// Add status change to history
orderSchema.methods.changeStatus = function (newStatus, changedBy, reason = "", notes = "") {
  if (this.status !== newStatus) {
    this.statusHistory.push({
      status: newStatus,
      changedBy,
      reason,
      notes,
    })
    this.status = newStatus
  }
}

// Calculate totals
orderSchema.methods.calculateTotals = function () {
  this.pricing.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0)
  this.pricing.totalAmount =
    this.pricing.subtotal + this.pricing.taxAmount + this.pricing.shippingAmount - this.pricing.discountAmount
}

module.exports = mongoose.model("Order", orderSchema)
