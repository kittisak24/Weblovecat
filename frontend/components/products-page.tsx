"use client"

import { useState, useMemo } from "react"
import { Search, Filter, Grid, List, Star, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

// Mock product data
const allProducts = [
  {
    id: 1,
    name: "อาหารสุนัขพรีเมี่ยม Royal Canin",
    price: 1299,
    originalPrice: 1499,
    rating: 4.8,
    reviews: 124,
    image: "/placeholder.svg?height=300&width=300",
    category: "อาหารสุนัข",
    brand: "Royal Canin",
    inStock: true,
    badge: "ขายดี",
    description: "อาหารสุนัขคุณภาพสูง เหมาะสำหรับสุนัขโตทุกสายพันธุ์",
  },
  {
    id: 2,
    name: "ของเล่นแมวอินเตอร์แอคทีฟ",
    price: 599,
    rating: 4.9,
    reviews: 89,
    image: "/placeholder.svg?height=300&width=300",
    category: "ของเล่นแมว",
    brand: "PetToy",
    inStock: true,
    badge: "ใหม่",
    description: "ของเล่นอัจฉริยะที่ช่วยกระตุ้นสมองแมว",
  },
  {
    id: 3,
    name: "บ้านสุนัขกันน้ำ Premium",
    price: 2499,
    originalPrice: 2999,
    rating: 4.7,
    reviews: 67,
    image: "/placeholder.svg?height=300&width=300",
    category: "บ้านสัตว์",
    brand: "PetHouse",
    inStock: true,
    badge: "ลดราคา",
    description: "บ้านสุนัขกันน้ำ ทนทาน เหมาะสำหรับใช้กลางแจ้ง",
  },
  {
    id: 4,
    name: "ปลอกคอแมวแฟชั่น",
    price: 299,
    rating: 4.6,
    reviews: 156,
    image: "/placeholder.svg?height=300&width=300",
    category: "อุปกรณ์แมว",
    brand: "CatStyle",
    inStock: true,
    description: "ปลอกคอแมวสไตล์เก๋ ปรับขนาดได้",
  },
  {
    id: 5,
    name: "อาหารแมวเปียก Whiskas",
    price: 45,
    rating: 4.5,
    reviews: 203,
    image: "/placeholder.svg?height=300&width=300",
    category: "อาหารแมว",
    brand: "Whiskas",
    inStock: true,
    description: "อาหารแมวเปียกรสปลาทูน่า อร่อยและมีประโยชน์",
  },
  {
    id: 6,
    name: "เสื้อผ้าสุนัขฤดูหนาว",
    price: 450,
    rating: 4.4,
    reviews: 78,
    image: "/placeholder.svg?height=300&width=300",
    category: "เสื้อผ้าสัตว์",
    brand: "PetFashion",
    inStock: false,
    description: "เสื้อกันหนาวสำหรับสุนัข อบอุ่นและสวยงาม",
  },
  {
    id: 7,
    name: "ชามอาหารสแตนเลส",
    price: 199,
    rating: 4.7,
    reviews: 145,
    image: "/placeholder.svg?height=300&width=300",
    category: "อุปกรณ์ให้อาหาร",
    brand: "PetBowl",
    inStock: true,
    description: "ชามอาหารสแตนเลสคุณภาพสูง ทำความสะอาดง่าย",
  },
  {
    id: 8,
    name: "ทรายแมวกลิ่นลาเวนเดอร์",
    price: 159,
    rating: 4.3,
    reviews: 92,
    image: "/placeholder.svg?height=300&width=300",
    category: "ทรายแมว",
    brand: "CatLitter",
    inStock: true,
    description: "ทรายแมวหอมกลิ่นลาเวนเดอร์ ดูดซับดีเยี่ยม",
  },
  {
    id: 9,
    name: "เชือกจูงสุนัขแบบยืด",
    price: 350,
    rating: 4.6,
    reviews: 134,
    image: "/placeholder.svg?height=300&width=300",
    category: "อุปกรณ์สุนัข",
    brand: "DogWalk",
    inStock: true,
    badge: "แนะนำ",
    description: "เชือกจูงสุนัขแบบยืดหยุ่น ปลอดภัยและสะดวก",
  },
  {
    id: 10,
    name: "ขนมสุนัขเสริมแคลเซียม",
    price: 129,
    rating: 4.8,
    reviews: 167,
    image: "/placeholder.svg?height=300&width=300",
    category: "ขนมสัตว์",
    brand: "HealthyTreat",
    inStock: true,
    description: "ขนมสุนัขเสริมแคลเซียม ช่วยเสริมสร้างกระดูกและฟัน",
  },
  {
    id: 11,
    name: "กรงนกแก้วขนาดใหญ่",
    price: 1899,
    rating: 4.5,
    reviews: 43,
    image: "/placeholder.svg?height=300&width=300",
    category: "กรงสัตว์",
    brand: "BirdCage",
    inStock: true,
    description: "กรงนกแก้วขนาดใหญ่ แข็งแรงและปลอดภัย",
  },
  {
    id: 12,
    name: "แชมพูสุนัขผิวแพ้ง่าย",
    price: 249,
    rating: 4.7,
    reviews: 98,
    image: "/placeholder.svg?height=300&width=300",
    category: "ผลิตภัณฑ์อาบน้ำ",
    brand: "GentleCare",
    inStock: true,
    description: "แชมพูสำหรับสุนัขผิวแพ้ง่าย อ่อนโยนและปลอดภัย",
  },
]

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
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด")
  const [sortBy, setSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const itemsPerPage = 9

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
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
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => b.id - a.id)
        break
      default:
        filtered.sort((a, b) => b.reviews - a.reviews)
    }

    return filtered
  }, [searchTerm, selectedCategory, sortBy])

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
            <h1 className="text-3xl lg:text-3xl font-bold text-gray-900 mb-4">สินค้าหมด</h1>
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

            {/* Products Grid/List */}
            {paginatedProducts.length > 0 ? (
              <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {paginatedProducts.map((product) => (
                  <div
                    key={product.id}
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
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-medium">สินค้าหมด</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className={`${viewMode === "grid" ? "p-4" : "flex-1"}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-coral-500 transition-colors line-clamp-2">
                          <Link href={`/products/${product.id}`}>{product.name}</Link>
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
                      <Button className="w-full bg-coral-500 hover:bg-coral-600 text-white" disabled={!product.inStock}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {product.inStock ? "เพิ่มใส่ตะกร้า" : "สินค้าหมด"}
                      </Button>
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
