"use client"

import { useState, useEffect } from "react"
import {
  BarChart3,
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
  Heart,
  Star,
  Package,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

// Mock data
const dashboardStats = {
  totalRevenue: 2450000,
  totalBookings: 1234,
  totalCustomers: 856,
  totalProducts: 245,
  monthlyGrowth: 12.5,
  customerSatisfaction: 4.8,
}

const recentBookings = [
  {
    id: "BK001234",
    customerName: "คุณสมใจ วงศ์ใหญ่",
    petName: "น้องโกลด์",
    service: "บริการตัดแต่งขน",
    date: "2024-06-20",
    time: "10:00",
    status: "confirmed",
    amount: 800,
  },
  {
    id: "BK001235",
    customerName: "คุณวิทยา ศรีสุข",
    petName: "น้องมิว",
    service: "คลินิกสัตวแพทย์",
    date: "2024-06-20",
    time: "14:30",
    status: "pending",
    amount: 1200,
  },
  {
    id: "BK001236",
    customerName: "คุณอนุชา ทองดี",
    petName: "น้องบราวน์",
    service: "บริการรับฝาก",
    date: "2024-06-21",
    time: "09:00",
    status: "completed",
    amount: 1500,
  },
]

const topProducts = [
  {
    id: 1,
    name: "อาหารสุนัขพรีเมี่ยม Royal Canin",
    category: "อาหารสุนัข",
    sales: 156,
    revenue: 202440,
    stock: 45,
    status: "in-stock",
  },
  {
    id: 2,
    name: "ของเล่นแมวอินเตอร์แอคทีฟ",
    category: "ของเล่นแมว",
    sales: 89,
    revenue: 53311,
    stock: 23,
    status: "low-stock",
  },
  {
    id: 3,
    name: "บ้านสุนัขกันน้ำ Premium",
    category: "บ้านสัตว์",
    sales: 67,
    revenue: 167333,
    stock: 0,
    status: "out-of-stock",
  },
]

const customerFeedback = [
  {
    id: 1,
    customerName: "คุณสมใจ วงศ์ใหญ่",
    service: "บริการตัดแต่งขน",
    rating: 5,
    comment: "บริการดีมาก ทีมงานใส่ใจและรักสัตว์จริงๆ",
    date: "2024-06-19",
    status: "published",
  },
  {
    id: 2,
    customerName: "คุณวิทยา ศรีสุข",
    service: "คลินิกสัตวแพทย์",
    rating: 5,
    comment: "ประทับใจมากค่ะ สัตวแพทย์ให้คำปรึกษาดี",
    date: "2024-06-18",
    status: "pending",
  },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "in-stock":
        return "bg-green-100 text-green-800"
      case "low-stock":
        return "bg-yellow-100 text-yellow-800"
      case "out-of-stock":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Logout handler
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-coral-500 mr-2" />
              <span className="text-xl font-bold text-gray-900">We Love cat Admin</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                ตั้งค่า
              </Button>
              <Link href="/admin/login">
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  ออกจากระบบ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
            <TabsTrigger value="bookings">การจอง</TabsTrigger>
            <TabsTrigger value="products">สินค้า</TabsTrigger>
            <TabsTrigger value="customers">ลูกค้า</TabsTrigger>
            <TabsTrigger value="reviews">รีวิว</TabsTrigger>
            <TabsTrigger value="reports">รายงาน</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">รายได้รวม</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(dashboardStats.totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">+{dashboardStats.monthlyGrowth}% จากเดือนที่แล้ว</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">การจองทั้งหมด</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalBookings.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+180 จากเดือนที่แล้ว</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ลูกค้าทั้งหมด</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalCustomers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+73 ลูกค้าใหม่</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ความพึงพอใจ</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.customerSatisfaction}/5</div>
                  <p className="text-xs text-muted-foreground">จาก 245 รีวิว</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    การจองล่าสุด
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-sm text-gray-600">{booking.service}</p>
                          <p className="text-xs text-gray-500">
                            {booking.date} {booking.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status === "confirmed"
                              ? "ยืนยันแล้ว"
                              : booking.status === "pending"
                                ? "รอยืนยัน"
                                : "เสร็จสิ้น"}
                          </Badge>
                          <p className="text-sm font-medium mt-1">{formatCurrency(booking.amount)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    สินค้าขายดี
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.slice(0, 3).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium line-clamp-1">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.category}</p>
                          <p className="text-xs text-gray-500">ขาย {product.sales} ชิ้น</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(product.status)}>
                            {product.status === "in-stock"
                              ? "มีสินค้า"
                              : product.status === "low-stock"
                                ? "สินค้าน้อย"
                                : "หมด"}
                          </Badge>
                          <p className="text-sm font-medium mt-1">{formatCurrency(product.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">จัดการการจอง</h2>
              <Button className="bg-coral-500 hover:bg-coral-600">
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มการจองใหม่
              </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ค้นหาการจอง..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="สถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="pending">รอยืนยัน</SelectItem>
                  <SelectItem value="confirmed">ยืนยันแล้ว</SelectItem>
                  <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                ส่งออก
              </Button>
            </div>

            {/* Bookings Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">รหัสจอง</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ลูกค้า</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">บริการ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">จำนวนเงิน</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {booking.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                              <div className="text-sm text-gray-500">{booking.petName}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.service}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.date} {booking.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status === "confirmed"
                                ? "ยืนยันแล้ว"
                                : booking.status === "pending"
                                  ? "รอยืนยัน"
                                  : "เสร็จสิ้น"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(booking.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">จัดการสินค้า</h2>
              <Button className="bg-coral-500 hover:bg-coral-600">
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มสินค้าใหม่
              </Button>
            </div>

            {/* Product Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">สินค้าทั้งหมด</p>
                      <p className="text-2xl font-bold">{dashboardStats.totalProducts}</p>
                    </div>
                    <Package className="h-8 w-8 text-coral-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">สินค้าหมด</p>
                      <p className="text-2xl font-bold text-red-600">12</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">สินค้าใกล้หมด</p>
                      <p className="text-2xl font-bold text-yellow-600">23</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">ยอดขายเดือนนี้</p>
                      <p className="text-2xl font-bold text-green-600">1,234</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Products Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สินค้า</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">หมวดหมู่</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ยอดขาย</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">คงเหลือ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">รายได้</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {topProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sales} ชิ้น</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock} ชิ้น</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusColor(product.status)}>
                              {product.status === "in-stock"
                                ? "มีสินค้า"
                                : product.status === "low-stock"
                                  ? "สินค้าน้อย"
                                  : "หมด"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(product.revenue)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">จัดการรีวิว</h2>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="สถานะรีวิว" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="pending">รอตรวจสอบ</SelectItem>
                    <SelectItem value="published">เผยแพร่แล้ว</SelectItem>
                    <SelectItem value="rejected">ปฏิเสธ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {customerFeedback.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{review.customerName}</h3>
                        <p className="text-sm text-gray-600">{review.service}</p>
                        <p className="text-xs text-gray-500">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <Badge
                          className={
                            review.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {review.status === "published" ? "เผยแพร่แล้ว" : "รอตรวจสอบ"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{review.comment}</p>
                    <div className="flex gap-2">
                      {review.status === "pending" && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            อนุมัติ
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            ปฏิเสธ
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        ตอบกลับ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">รายงานและสถิติ</h2>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                ส่งออกรายงาน
              </Button>
            </div>

            {/* Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">รายงานรายได้</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">รายได้วันนี้</span>
                      <span className="font-medium">{formatCurrency(45000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">รายได้สัปดาห์นี้</span>
                      <span className="font-medium">{formatCurrency(285000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">รายได้เดือนนี้</span>
                      <span className="font-medium">{formatCurrency(1250000)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">รายงานบริการ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ตัดแต่งขน</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">คลินิกสัตวแพทย์</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">รับฝากสัตว์</span>
                      <span className="font-medium">25%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">รายงานลูกค้า</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ลูกค้าใหม่เดือนนี้</span>
                      <span className="font-medium">73 คน</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ลูกค้าประจำ</span>
                      <span className="font-medium">456 คน</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">อัตราการกลับมา</span>
                      <span className="font-medium">78%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Performance Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>ผลการดำเนินงานรายเดือน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">กราฟแสดงผลการดำเนินงาน</p>
                    <p className="text-sm text-gray-400">จะแสดงข้อมูลรายได้และการจองรายเดือน</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
