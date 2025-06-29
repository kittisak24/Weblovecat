require("dotenv").config()
const mongoose = require("mongoose")
const User = require("../models/User")

const createAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    // Admin users data
    const adminUsers = [
      {
        username: "admin",
        email: "admin@welovepet.com",
        passwordHash: "Admin123!",
        firstName: "System",
        lastName: "Administrator",
        role: "system_admin",
        emailVerified: true,
        isActive: true,
      },
      {
        username: "manager",
        email: "manager@welovepet.com",
        passwordHash: "Manager123!",
        firstName: "Store",
        lastName: "Manager",
        role: "manager",
        emailVerified: true,
        isActive: true,
      },
    ]

    for (const adminData of adminUsers) {
      // Check if admin already exists
      const existingAdmin = await User.findOne({
        $or: [{ username: adminData.username }, { email: adminData.email }],
      })

      if (existingAdmin) {
        console.log(`❌ Admin with username "${adminData.username}" or email "${adminData.email}" already exists`)
        continue
      }

      // Create admin user
      const admin = new User(adminData)
      await admin.save()

      console.log(`✅ Created ${adminData.role}: ${adminData.username} (${adminData.email})`)
    }

    console.log("\n🎉 Admin users creation completed!")
    console.log("\n📋 Admin Login Credentials:")
    console.log("┌─────────────────┬──────────────────────┬─────────────┬──────────────┐")
    console.log("│ Role            │ Username             │ Email       │ Password     │")
    console.log("├─────────────────┼──────────────────────┼─────────────┼──────────────┤")
    console.log("│ System Admin    │ admin                │ admin@...   │ Admin123!    │")
    console.log("│ Store Manager   │ manager              │ manager@... │ Manager123!  │")
    console.log("└─────────────────┴──────────────────────┴─────────────┴──────────────┘")
    console.log("\n⚠️  Please change these default passwords after first login!")
  } catch (error) {
    console.error("Error creating admin users:", error)
  } finally {
    await mongoose.disconnect()
    process.exit(0)
  }
}

createAdmin()
