const mongoose = require("mongoose");

const serviceBookingSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0, // เพิ่ม validation
    },
    bookingNumber: {
      type: String,
      unique: true,
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: 'Invalid time format. Use HH:MM'
      }
    },
    endTime: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: 'Invalid time format. Use HH:MM'
      }
    },
    petDetails: {
      name: String,
      species: String,
      breed: String,
      age: {
        years: Number,
        months: Number,
      },
      weight: Number,
      gender: String,
      color: String,
      specialNotes: String,
      healthInfo: {
        vaccinations: [
          {
            type: String,
            date: Date,
            nextDue: Date,
          },
        ],
        allergies: [String],
        medications: [String],
        conditions: [String],
      },
      photos: [String],
    },
    serviceLocation: {
      type: String,
      enum: ["clinic", "home"],
      default: "clinic",
    },
    address: {
      addressLine1: String,
      addressLine2: String,
      district: String,
      province: String,
      postalCode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
      accessInstructions: String,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in_progress", "completed", "cancelled", "no_show", "rescheduled"],
      default: "pending",
    },
    confirmation: {
      isConfirmed: {
        type: Boolean,
        default: false,
      },
      confirmedAt: Date,
      confirmedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      reminderSent: {
        type: Boolean,
        default: false,
      },
    },
    service: {
      startedAt: Date,
      completedAt: Date,
      actualDuration: Number,
      serviceNotes: String,
      results: {
        beforePhotos: [String],
        afterPhotos: [String],
        observations: String,
        recommendations: String,
        followUpRequired: Boolean,
        followUpDate: Date,
      },
      providedBy: [
        {
          staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          name: String,
          role: String,
        },
      ],
    },
    cancellation: {
      cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      cancelledAt: Date,
      reason: String,
      refundAmount: Number,
      refundProcessed: Boolean,
    },
    customerNotes: String,
    serviceNotes: String,
  },
  {
    timestamps: true,
  }
);

// เพิ่ม indexes สำหรับ performance
serviceBookingSchema.index({ serviceId: 1, bookingDate: 1, startTime: 1 });
serviceBookingSchema.index({ userId: 1, bookingDate: -1 });
serviceBookingSchema.index({ status: 1 });
serviceBookingSchema.index({ bookingNumber: 1 });

// ปรับปรุง pre-save hook
serviceBookingSchema.pre("save", async function (next) {
  if (this.isNew && !this.bookingNumber) {
    const count = await this.constructor.countDocuments();
    this.bookingNumber = `BK${String(count + 1).padStart(6, "0")}`;
  }
  
  // Validate end time is after start time
  if (this.startTime && this.endTime) {
    const start = new Date(`2000-01-01T${this.startTime}:00`);
    const end = new Date(`2000-01-01T${this.endTime}:00`);
    if (end <= start) {
      throw new Error('End time must be after start time');
    }
  }
  
  next();
});

module.exports = mongoose.model("ServiceBooking", serviceBookingSchema);