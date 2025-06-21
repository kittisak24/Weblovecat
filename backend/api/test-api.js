// Test script for the Backend API
const fetch = require("node-fetch")

const API_BASE_URL = "http://localhost:8000/api"

// Test credentials
const testUsers = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "manager", password: "manager123", role: "admin" },
  { username: "staff", password: "staff123", role: "staff" },
]

let authToken = null

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    console.log(`\n📡 ${options.method || "GET"} ${endpoint}`)
    console.log(`📊 Status: ${response.status} ${response.statusText}`)
    console.log(`📄 Response:`, JSON.stringify(data, null, 2))

    return { response, data }
  } catch (error) {
    console.error(`❌ Error calling ${endpoint}:`, error.message)
    return { error }
  }
}

// Test functions
async function testHealthCheck() {
  console.log("\n🏥 Testing Health Check...")
  await apiRequest("/health")
}

async function testLogin(username, password) {
  console.log(`\n🔐 Testing Login for ${username}...`)
  const { response, data } = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })

  if (response && response.ok && data.token) {
    authToken = data.token
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

async function testChangePassword() {
  console.log("\n🔑 Testing Change Password...")
  await apiRequest("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({
      currentPassword: "admin123",
      newPassword: "newpassword123",
    }),
  })
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
    body: JSON.stringify({
      username: "testuser",
      email: "test@welovepet.com",
      password: "testpass123",
      name: "Test User",
      role: "staff",
    }),
  })
}

async function testInvalidLogin() {
  console.log("\n❌ Testing Invalid Login...")
  await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      username: "invalid",
      password: "wrongpassword",
    }),
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

// Main test runner
async function runTests() {
  console.log("🧪 Starting API Tests for We Love Pet Backend")
  console.log("=".repeat(50))

  try {
    // Basic tests
    await testHealthCheck()
    await testInvalidLogin()
    await testUnauthorizedAccess()

    // Login and authenticated tests
    const loginSuccess = await testLogin("admin", "admin123")

    if (loginSuccess) {
      await testGetCurrentUser()
      await testAdminStats()
      await testGetAllUsers()
      await testCreateUser()
      // await testChangePassword(); // Commented out to avoid changing password
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
