"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Filter, Grid, List, Star, ShoppingCart, Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import Link from "next/link"


const sortOptions = [
  { value: "popular", label: "ความนิยม" },
  { value: "price-low", label: "ราคา: ต่ำ - สูง" },
  { value: "price-high", label: "ราคา: สูง - ต่ำ" },
  { value: "rating", label: "คะแนนรีวิว" },
  { value: "newest", label: "สินค้าใหม่" },
]

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export default function ProductsPage() {
  // State สำหรับข้อมูลสินค้า
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(["ทั้งหมด"])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  // State สำหรับการกรองและค้นหา
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด")
  const [sortBy, setSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  
  const itemsPerPage = 9

  // ฟังก์ชันดึงข้อมูลหมวดหมู่
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/categories`)
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // ฟังก์ชันดึงข้อมูลสินค้า
  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sortBy,
      })

      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory && selectedCategory !== 'ทั้งหมด') {
        params.append('category', selectedCategory)
      }

      const response = await fetch(`${API_BASE_URL}/api/products?${params}`)
      const data = await response.json()

      if (data.success) {
        setProducts(data.data.products)
        setPagination(data.data.pagination)
      } else {
        setError(data.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // ดึงข้อมูลหมวดหมู่เมื่อ component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  // ดึงข้อมูลสินค้าเมื่อมีการเปลี่ยนแปลงพารามิเตอร์
  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchTerm, selectedCategory, sortBy])

  // ฟังก์ชันจัดรูปแบบราคา
  const formatPrice = (price: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  }).format(price)
}

  // ฟังก์ชันเปลี่ยนหมวดหมู่
const handleCategoryChange = (category: string) => {
  setSelectedCategory(category)
  setCurrentPage(1)
}

  // ฟังก์ชันค้นหา
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  // ฟังก์ชันเปลี่ยนการเรียงลำดับ
  const handleSortChange = (value: string) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-coral-500 text-black to-coral-300">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center">
						<h1 className="text-3xl lg:text-3xl font-bold text-gray-900 mb-4">
							สินค้าทั้งหมด
						</h1>
						<p className="text-2l text-gray-600">
							เลือกซื้อสินค้าคุณภาพสูงสำหรับสัตว์เลี้ยงที่คุณรัก
						</p>
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
                    onClick={() => handleCategoryChange(category)}
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
                    onChange={(e) => handleSearchChange(e.target.value)}
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
                  <Select value={sortBy} onValueChange={handleSortChange}>
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
              {!loading && (
                <div className="mt-4 text-sm text-gray-600">
                  แสดง {((pagination.currentPage - 1) * itemsPerPage) + 1}-{Math.min(pagination.currentPage * itemsPerPage, pagination.totalProducts)} จาก{" "}
                  {pagination.totalProducts} รายการ
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-coral-500 mr-2" />
                <span className="text-gray-600">กำลังโหลดสินค้า...</span>
              </div>
            )}

            {/* Products Grid/List */}
            {!loading && products.length > 0 ? (
              <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {products.map((product) => (
                  <div
                    key={product._id}
                    className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ${
                      viewMode === "list" ? "flex gap-4 p-4" : "overflow-hidden"
                    }`}
                  >
                    {/* Product Image */}
                    <div
                      className={`relative ${viewMode === "list" ? "w-32 h-32 flex-shrink-0" : "w-full h-64"} overflow-hidden ${viewMode === "grid" ? "rounded-t-lg" : "rounded-lg"}`}
                    >
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {product.badge && (
                        <div className="absolute top-2 left-2">
                          <Badge
                            className={
                              product.badge === "ขายดี"
                                ? "bg-coral-500"
                                : product.badge === "ใหม่"
                                  ? "bg-green-500"
                                  : product.badge === "ลดราคา"
                                    ? "bg-orange-500"
                                    : "bg-blue-500"
                            }
                          >
                            {product.badge}
                          </Badge>
                        </div>
                      )}
                      {(product.inStock === false || Number(product.stock || 0) === 0) && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-medium">สินค้าหมด</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className={`${viewMode === "grid" ? "p-4" : "flex-1"}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-coral-500 transition-colors line-clamp-2">
                          <Link href={`/products/${product._id}`}>{product.name}</Link>
                        </h3>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-coral-500">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{product.brand}</p>

                      {viewMode === "list" && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      )}

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                        </div>
                        <span className="text-sm text-gray-400">({product.reviews})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <Button className="w-full bg-coral-500 hover:bg-coral-600 text-white" disabled={(product.inStock === false || Number(product.stock || 0) === 0)}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {product.inStock ? "เพิ่มใส่ตะกร้า" : "สินค้าหมด"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : !loading && products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบสินค้าที่ค้นหา</h3>
                <p className="text-gray-600">ลองเปลี่ยนคำค้นหาหรือหมวดหมู่สินค้า</p>
              </div>
            ) : null}

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={!pagination.hasPrevPage}
                >
                  ก่อนหน้า
                </Button>

                {[...Array(pagination.totalPages)].map((_, index) => {
                  const page = index + 1
                  if (page === 1 || page === pagination.totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
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
                  onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                  disabled={!pagination.hasNextPage}
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