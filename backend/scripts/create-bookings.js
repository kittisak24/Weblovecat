require("dotenv").config();
const mongoose = require("mongoose");
const ServiceBooking = require("../models/ServiceBooking");
const User = require("../models/User");
const Service = require("../models/Service");
const Category = require("../models/Category");

// MongoDB connection
async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}

// Sample recent bookings data
const recentBookings = [
  {
    id: "BK001234",
    customerName: "คุณสมใจ วงศ์ใหญ่",
    petName: "น้องโกลด์",
    service: "บริการตัดแต่งขน",
    date: "2024-06-20",
    time: "10:00",
    status: "confirmed",
    amount: 800,
  },
  {
    id: "BK001235",
    customerName: "คุณวิทยา ศรีสุข",
    petName: "น้องมิว",
    service: "คลินิกสัตวแพทย์",
    date: "2024-06-20",
    time: "14:30",
    status: "pending",
    amount: 1200,
  },
  {
    id: "BK001236",
    customerName: "คุณอนุชา ทองดี",
    petName: "น้องบราวน์",
    service: "บริการรับฝาก",
    date: "2024-06-21",
    time: "09:00",
    status: "completed",
    amount: 1500,
  },
];

// Helper function to find or create a User
async function findOrCreateUser(customerName) {
  const [firstName, lastName] = customerName.replace("คุณ", "").trim().split(" ");
  const email = `${firstName || "user"}.${lastName || "unknown"}@example.com`.toLowerCase();
  const usernameBase = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "") || "user";
  let username = usernameBase;
  let counter = 1;

  while (await User.findOne({ username })) {
    username = `${usernameBase}${counter}`;
    counter++;
  }

  let user = await User.findOne({ firstName, lastName });
  if (!user) {
    user = new User({
      firstName: firstName || "Unknown",
      lastName: lastName || "Unknown",
      email: email,
      phone: "000-000-0000",
      username: username,
      passwordHash: "defaultpassword",
    });
    await user.save();
  }
  return user;
}

// เพิ่มฟังก์ชันสร้าง slug
function createSlug(serviceName) {
  return serviceName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// Helper function to find or create a Service
async function findOrCreateService(serviceName, amount) {
  let service = await Service.findOne({ name: serviceName });
  if (!service) {
    let category = await Category.findOne({ name: "Default Category" });
    if (!category) {
      category = new Category({ name: "Default Category" });
      await category.save();
    }

    // ใช้วิธีง่ายๆ ในการสร้าง slug
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const slug = `service-${timestamp}-${random}`;

    console.log(`Creating service: ${serviceName} with slug: ${slug}`);

    service = new Service({
      name: serviceName,
      slug: slug,
      serviceDetails: {
        durationMinutes: 60,
      },
      pricing: {
        basePrice: amount || 0,
      },
      description: `Description for ${serviceName}`,
      categoryId: category._id,
    });

    await service.save();
    console.log(`✓ Created service: ${serviceName}`);
  }
  return service;
}

// Main function to create bookings
async function createBookings() {
  await connectDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
    const existingBookings = await ServiceBooking.find({
      bookingNumber: { $in: recentBookings.map(b => b.id) }
    }).session(session);

    if (existingBookings.length > 0) {
      console.log("Some bookings already exist. Skipping...");
      await session.abortTransaction();
      return;
    }

    // เคลียร์ข้อมูลเก่าเฉพาะที่จำเป็น
    await ServiceBooking.deleteMany({
      bookingNumber: { $in: recentBookings.map(b => b.id) }
    }).session(session);

    for (const booking of recentBookings) {
      try {
        const user = await findOrCreateUser(booking.customerName);
        const service = await findOrCreateService(booking.service, booking.amount);

        // Validate time format
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(booking.time)) {
          throw new Error(`Invalid time format: ${booking.time}`);
        }

        const [hours, minutes] = booking.time.split(":").map(Number);
        const endHours = hours + 1;
        const endTime = `${endHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

        const newBooking = new ServiceBooking({
          bookingNumber: booking.id,
          userId: user._id,
          serviceId: service._id,
          bookingDate: new Date(booking.date),
          startTime: booking.time,
          endTime,
          amount: booking.amount, // ใส่ amount
          petDetails: {
            name: booking.petName,
          },
          serviceLocation: "clinic",
          status: booking.status,
          confirmation: {
            isConfirmed: booking.status === "confirmed",
            confirmedAt: booking.status === "confirmed" ? new Date() : undefined,
          },
        });

        await newBooking.save({ session });
        console.log(`✓ Saved booking ${booking.id}`);
      } catch (error) {
        console.error(`✗ Error saving booking ${booking.id}:`, error.message);
        throw error;
      }
    }

    await session.commitTransaction();
    console.log("🎉 All bookings saved successfully");

    const count = await ServiceBooking.countDocuments();
    console.log(`📊 Total bookings in database: ${count}`);
  } catch (error) {
    await session.abortTransaction();
    console.error("❌ Error saving bookings:", error.message);
    throw error;
  } finally {
    session.endSession();
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
}

// Run the script
if (require.main === module) {
  createBookings();
}

module.exports = createBookings;