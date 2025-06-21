"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminDashboard from "@/components/admin-dashboard"


export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        if (res.ok) {
          setIsAuthenticated(true)
        } else {
          router.replace("/admin/login")
        }
      } catch {
        router.replace("/admin/login")
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">กำลังโหลด...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return <AdminDashboard />
}
