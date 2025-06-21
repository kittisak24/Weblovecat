"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminDashboard from "@/components/admin-dashboard"


export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (token !== "demo_token") {
      router.replace("/admin/login")
    }
  }, [router])

  return <AdminDashboard />
}
