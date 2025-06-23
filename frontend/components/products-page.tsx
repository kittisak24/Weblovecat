"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Filter, Grid, List, Star, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

const categories = [
  "ทั้งหมด",
  "อาหารสุนัข",
  "อาหารแมว",
  "ของเล่นแมว",
  "อุปกรณ์สุนัข",
  "อุปกรณ์แมว",
  "บ้านสัตว์",
  "เสื้อผ้าสัตว์",
  "อุปกรณ์ให้อาหาร",
  "ทรายแมว",
  "ขนมสัตว์",
  "กรงสัตว์",
  "ผลิตภัณฑ์อาบน้ำ",
]

const sortOptions = [
  { value: "popular", label: "ความนิยม" },
  { value: "price-low", label: "ราคา: ต่ำ - สูง" },
  { value: "price-high", label: "ราคา: สูง - ต่ำ" },
  { value: "rating", label: "คะแนนรีวิว" },
  { value: "newest", label: "สินค้าใหม่" },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด")
  const [sortBy, setSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const itemsPerPage = 9

  useEffect(() => {
    setLoading(true)
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        setError("เกิดข้อผิดพลาดในการโหลดสินค้า")
        setLoading(false)
      })
  }, [])

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "ทั้งหมด" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      default:
        filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
    }

    return filtered
  }, [products, searchTerm, selectedCategory, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-coral-500 text-black to-coral-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl lg:text-3xl font-bold text-gray-900 mb-4">สินค้า</h1>
            <p className="text-2l text-gray-600">เลือกซื้อสินค้าคุณภาพสูงสำหรับสัตว์เลี้ยงที่คุณรัก</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">หมวดหมู่สินค้า</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      setCurrentPage(1)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === category
                        ? "bg-coral-100 text-coral-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Controls */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="ค้นหาสินค้า..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="pl-10"
                  />
                </div>

                <div className="flex items-center gap-4">
                  {/* Mobile Filter Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    กรอง
                  </Button>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* View Mode */}
                  <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 text-sm text-gray-600">
                แสดง {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedProducts.length)} จาก{" "}
                {filteredAndSortedProducts.length} รายการ
              </div>
            </div>

            {/* Loading/Error */}
            {loading ? (
              <div className="text-center py-12 text-gray-500">กำลังโหลดสินค้า...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">{error}</div>
            ) : paginatedProducts.length > 0 ? (
              <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {paginatedProducts.map((product) => (
                  <div
                    key={product._id}
                    className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ${
                      viewMode === "list" ? "flex gap-4 p-4" : "overflow-hidden"
                    }`}
                  >
                    {/* Product Image */}
                    <Image
                      src={product.image || "/placeholder.svg?height=300&width=300"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="object-cover w-full h-48 rounded-t-lg"
                    />
                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg text-gray-900">{product.name}</span>
                        {product.badge && <Badge>{product.badge}</Badge>}
                      </div>
                      <div className="text-coral-700 font-bold text-xl">{formatPrice(product.price)}</div>
                      {product.originalPrice && (
                        <div className="text-gray-400 line-through text-sm">{formatPrice(product.originalPrice)}</div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-400" />
                        {product.rating || 0} ({product.reviews || 0} รีวิว)
                      </div>
                      <div className="text-gray-500 text-sm">{product.description}</div>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          <ShoppingCart className="h-4 w-4 mr-1" /> หยิบใส่ตะกร้า
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบสินค้าที่ค้นหา</h3>
                <p className="text-gray-600">ลองเปลี่ยนคำค้นหาหรือหมวดหมู่สินค้า</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  ก่อนหน้า
                </Button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "bg-coral-500 hover:bg-coral-600" : ""}
                      >
                        {page}
                      </Button>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2">
                        ...
                      </span>
                    )
                  }
                  return null
                })}

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  ถัดไป
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
