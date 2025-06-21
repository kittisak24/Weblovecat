// Fixed Test script for the Backend API
const https = require("https")
const http = require("http")

const API_BASE_URL = "http://localhost:3001/api"

// Test credentials
const testUsers = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "manager", password: "manager123", role: "admin" },
  { username: "staff", password: "staff123", role: "staff" },
]

let authToken = null

// Simple HTTP request function (no external dependencies)
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const isHttps = urlObj.protocol === "https:"
    const client = isHttps ? https : http

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...options.headers,
      },
    }

    const req = client.request(requestOptions, (res) => {
      let data = ""

      res.on("data", (chunk) => {
        data += chunk
      })

      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data)
          resolve({
            status: res.statusCode,
            statusText: res.statusMessage,
            data: jsonData,
            ok: res.statusCode >= 200 && res.statusCode < 300,
          })
        } catch (error) {
          resolve({
            status: res.statusCode,
            statusText: res.statusMessage,
            data: data,
            ok: res.statusCode >= 200 && res.statusCode < 300,
          })
        }
      })
    })

    req.on("error", (error) => {
      reject(error)
    })

    if (options.body) {
      req.write(options.body)
    }

    req.end()
  })
}

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await makeRequest(url, {
      method: options.method || "GET",
      headers: options.headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    console.log(`\n📡 ${options.method || "GET"} ${endpoint}`)
    console.log(`📊 Status: ${response.status} ${response.statusText}`)
    console.log(`📄 Response:`, JSON.stringify(response.data, null, 2))

    return response
  } catch (error) {
    console.error(`❌ Error calling ${endpoint}:`, error.message)
    return { error: error.message }
  }
}

// Test functions
async function testHealthCheck() {
  console.log("\n🏥 Testing Health Check...")
  await apiRequest("/health")
}

async function testApiInfo() {
  console.log("\n📖 Testing API Info...")
  await apiRequest("")
}

async function testLogin(username, password) {
  console.log(`\n🔐 Testing Login for ${username}...`)
  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: { username, password },
  })

  if (response && response.ok && response.data.token) {
    authToken = response.data.token
    console.log(`✅ Login successful! Token saved.`)
    return true
  } else {
    console.log(`❌ Login failed!`)
    return false
  }
}

async function testGetCurrentUser() {
  console.log("\n👤 Testing Get Current User...")
  await apiRequest("/auth/me")
}

async function testAdminStats() {
  console.log("\n📊 Testing Admin Stats...")
  await apiRequest("/admin/stats")
}

async function testGetAllUsers() {
  console.log("\n👥 Testing Get All Users (Admin only)...")
  await apiRequest("/admin/users")
}

async function testCreateUser() {
  console.log("\n➕ Testing Create User (Admin only)...")
  await apiRequest("/admin/users", {
    method: "POST",
    body: {
      username: "testuser",
      email: "test@welovepet.com",
      password: "testpass123",
      name: "Test User",
      role: "staff",
    },
  })
}

async function testInvalidLogin() {
  console.log("\n❌ Testing Invalid Login...")
  await apiRequest("/auth/login", {
    method: "POST",
    body: {
      username: "invalid",
      password: "wrongpassword",
    },
  })
}

async function testUnauthorizedAccess() {
  console.log("\n🚫 Testing Unauthorized Access...")
  const tempToken = authToken
  authToken = null // Remove token
  await apiRequest("/auth/me")
  authToken = tempToken // Restore token
}

async function testLogout() {
  console.log("\n🚪 Testing Logout...")
  await apiRequest("/auth/logout", {
    method: "POST",
  })
  authToken = null
}

async function test404() {
  console.log("\n🔍 Testing 404 Not Found...")
  await apiRequest("/nonexistent")
}

// Wait for server to be ready
async function waitForServer(maxAttempts = 10) {
  console.log("⏳ Waiting for server to be ready...")

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await apiRequest("/health")
      if (response && response.ok) {
        console.log("✅ Server is ready!")
        return true
      }
    } catch (error) {
      console.log(`⏳ Attempt ${i + 1}/${maxAttempts} - Server not ready yet...`)
    }

    // Wait 2 seconds before next attempt
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  console.log("❌ Server is not responding after maximum attempts")
  return false
}

// Main test runner
async function runTests() {
  console.log("🧪 Starting API Tests for We Love Pet Backend")
  console.log("=".repeat(50))

  try {
    // Wait for server to be ready
    const serverReady = await waitForServer()
    if (!serverReady) {
      console.log("❌ Cannot run tests - server is not responding")
      console.log("💡 Make sure to start the server first:")
      console.log("   node scripts/backend-server-fixed.js")
      return
    }

    // Basic tests
    await testApiInfo()
    await testHealthCheck()
    await test404()
    await testInvalidLogin()
    await testUnauthorizedAccess()

    // Login and authenticated tests
    const loginSuccess = await testLogin("admin", "admin123")

    if (loginSuccess) {
      await testGetCurrentUser()
      await testAdminStats()
      await testGetAllUsers()
      await testCreateUser()
      await testLogout()
    }

    // Test different user roles
    console.log("\n🔄 Testing different user roles...")
    for (const user of testUsers) {
      await testLogin(user.username, user.password)
      if (authToken) {
        await testGetCurrentUser()
        if (user.role === "admin") {
          await testAdminStats()
        }
        await testLogout()
      }
    }

    console.log("\n✅ All tests completed!")
    console.log("=".repeat(50))
  } catch (error) {
    console.error("❌ Test runner error:", error)
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests()
}

module.exports = {
  apiRequest,
  testLogin,
  testHealthCheck,
  runTests,
}
