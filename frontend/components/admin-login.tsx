"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Lock, User } from "lucide-react"

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("http://localhost:8000/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        localStorage.setItem("admin_token", data.data.accessToken)
        // เก็บ username และ role ลง localStorage
        localStorage.setItem("admin_username", credentials.username)
        localStorage.setItem("admin_role", data.data.role || "admin")
        // ถ้าต้องการเก็บ refreshToken ด้วย
        router.push("/admin")
      } else {
        let errorMsg = data.error || data.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
        if (typeof errorMsg === "object") {
          errorMsg = errorMsg.message || JSON.stringify(errorMsg)
        }
        setError(errorMsg)
      }
    } catch (err) {
      if (typeof err === "string") {
        setError(err)
      } else if (err && typeof err === "object" && "message" in err) {
        setError((err as any).message || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์")
      } else {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์")
      }
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-coral-500 mr-2" />
            <span className="text-2xl font-bold text-gray-900">Web Love Cat</span>
          </div>
          <CardTitle className="text-xl">เข้าสู่ระบบจัดการ</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">ชื่อผู้ใช้</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="กรอกชื่อผู้ใช้"
                  value={credentials.username}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="กรอกรหัสผ่าน"
                  value={credentials.password}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}

            <Button type="submit" className="w-full bg-coral-500 hover:bg-coral-600" disabled={isLoading}>
              {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
