// Quick start script - installs dependencies and starts server
const { execSync } = require("child_process")
const { setup } = require("./install-dependencies")

async function quickStart() {
  console.log("🚀 We Love Pet Backend - Quick Start")
  console.log("=".repeat(40))

  try {
    // Run setup
    await setup()

    console.log("\n🚀 Starting server...")

    // Start the server
    execSync("node scripts/backend-server.js", {
      stdio: "inherit",
    })
  } catch (error) {
    console.error("❌ Quick start failed:", error.message)
    console.log("\n🔧 Manual steps:")
    console.log("1. npm install")
    console.log("2. node scripts/backend-server.js")
    process.exit(1)
  }
}

if (require.main === module) {
  quickStart()
}
