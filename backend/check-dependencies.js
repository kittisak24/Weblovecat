// Check if all required dependencies are installed
const fs = require("fs")
const path = require("path")

const requiredDependencies = [
  "express",
  "bcryptjs",
  "jsonwebtoken",
  "cors",
  "express-rate-limit",
  "node-fetch",
  "helmet",
  "morgan",
  "dotenv",
]

const optionalDependencies = ["nodemon", "jest", "supertest"]

function checkDependency(packageName) {
  try {
    require.resolve(packageName)
    return true
  } catch (error) {
    return false
  }
}

function checkAllDependencies() {
  console.log("🔍 Checking dependencies...")
  console.log("=".repeat(40))

  let allRequired = true
  let someOptional = false

  // Check required dependencies
  console.log("\n📦 Required dependencies:")
  for (const dep of requiredDependencies) {
    const isInstalled = checkDependency(dep)
    const status = isInstalled ? "✅" : "❌"
    console.log(`${status} ${dep}`)

    if (!isInstalled) {
      allRequired = false
    }
  }

  // Check optional dependencies
  console.log("\n🛠️  Development dependencies:")
  for (const dep of optionalDependencies) {
    const isInstalled = checkDependency(dep)
    const status = isInstalled ? "✅" : "⚠️ "
    console.log(`${status} ${dep}`)

    if (isInstalled) {
      someOptional = true
    }
  }

  console.log("\n" + "=".repeat(40))

  if (allRequired) {
    console.log("✅ All required dependencies are installed!")

    if (someOptional) {
      console.log("✅ Development dependencies are available!")
    } else {
      console.log("⚠️  Development dependencies are missing (optional)")
    }

    console.log("\n🚀 You can start the server with:")
    console.log("   node scripts/backend-server.js")

    return true
  } else {
    console.log("❌ Some required dependencies are missing!")
    console.log("\n🔧 Install missing dependencies:")
    console.log("   npm install")
    console.log("   or")
    console.log("   node scripts/install-dependencies.js")

    return false
  }
}

// Check package.json exists
function checkPackageJson() {
  const packageJsonPath = path.join(process.cwd(), "package.json")

  if (!fs.existsSync(packageJsonPath)) {
    console.log("⚠️  package.json not found")
    console.log("Creating package.json...")

    // This would be handled by the package.json file we created above
    return false
  }

  return true
}

if (require.main === module) {
  console.log("🔍 We Love Pet Backend - Dependency Checker")

  if (checkPackageJson()) {
    checkAllDependencies()
  }
}

module.exports = {
  checkDependency,
  checkAllDependencies,
  requiredDependencies,
  optionalDependencies,
}
