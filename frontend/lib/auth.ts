import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

const secretKey = process.env.JWT_SECRET || "your-secret-key-here"
const key = new TextEncoder().encode(secretKey)

export interface User {
  id: string
  username: string
  email: string
  role: "admin" | "user"
  name: string
}

// Mock user database (replace with real database)
const users: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@welovepet.com",
    role: "admin",
    name: "ผู้ดูแลระบบ",
  },
  {
    id: "2",
    username: "manager",
    email: "manager@welovepet.com",
    role: "admin",
    name: "ผู้จัดการ",
  },
]

// Mock password database (in real app, use hashed passwords)
const passwords: Record<string, string> = {
  admin: "admin123",
  manager: "manager123",
}

export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key)
    return payload
  } catch (error) {
    return null
  }
}

export async function authenticate(username: string, password: string): Promise<User | null> {
  const user = users.find((u) => u.username === username)
  if (!user || passwords[username] !== password) {
    return null
  }
  return user
}

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    return null
  }

  const payload = await verifyToken(token)
  if (!payload || !payload.userId) {
    return null
  }

  const user = users.find((u) => u.id === payload.userId)
  return user || null
}

export async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    return null
  }

  const payload = await verifyToken(token)
  if (!payload || !payload.userId) {
    return null
  }

  const user = users.find((u) => u.id === payload.userId)
  return user || null
}

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin"
}
