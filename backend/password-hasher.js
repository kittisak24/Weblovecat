// Utility script to generate password hashes
const bcrypt = require("bcryptjs")

async function hashPassword(password) {
  try {
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)
    console.log(`Password: ${password}`)
    console.log(`Hash: ${hash}`)
    console.log("---")
    return hash
  } catch (error) {
    console.error("Error hashing password:", error)
  }
}

async function verifyPassword(password, hash) {
  try {
    const isValid = await bcrypt.compare(password, hash)
    console.log(`Password: ${password}`)
    console.log(`Hash: ${hash}`)
    console.log(`Valid: ${isValid}`)
    console.log("---")
    return isValid
  } catch (error) {
    console.error("Error verifying password:", error)
  }
}

// Generate hashes for default passwords
async function generateDefaultHashes() {
  console.log("🔐 Generating password hashes for default users...\n")

  const passwords = ["admin123", "manager123", "staff123"]

  for (const password of passwords) {
    await hashPassword(password)
  }

  console.log("✅ Hash generation complete!")
}

// Test password verification
async function testPasswordVerification() {
  console.log("\n🧪 Testing password verification...\n")

  const testHash = "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"

  await verifyPassword("admin123", testHash)
  await verifyPassword("wrongpassword", testHash)

  console.log("✅ Verification test complete!")
}

// Run if executed directly
if (require.main === module) {
  generateDefaultHashes().then(() => {
    return testPasswordVerification()
  })
}

module.exports = {
  hashPassword,
  verifyPassword,
}
