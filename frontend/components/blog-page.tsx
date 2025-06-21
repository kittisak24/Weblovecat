"use client"

import { useState, useMemo } from "react"
import { Calendar, User, Clock, ArrowRight, Search, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

const articles = [
  {
    id: 1,
    title: "5 วิธีดูแลสุนัขในหน้าร้อนให้ปลอดภัย",
    excerpt: "เคล็ดลับการดูแลสุนัขในช่วงอากาศร้อน เพื่อป้องกันอาการเป็นลมและปัญหาสุขภาพอื่นๆ ที่อาจเกิดขึ้นได้",
    content:
      "ในช่วงหน้าร้อนที่อุณหภูมิสูง สุนัขมีความเสี่ยงต่อการเป็นลมร้อนและปัญหาสุขภาพต่างๆ การดูแลที่ถูกวิธีจะช่วยให้น้องหมาผ่านพ้นฤดูร้อนได้อย่างปลอดภัย...",
    date: "2024-06-15",
    author: "ดร.สมใจ ใจดี",
    category: "การดูแล",
    tags: ["สุนัข", "หน้าร้อน", "สุขภาพ"],
    image: "/placeholder.svg?height=200&width=300",
    readTime: "5 นาที",
    views: 1234,
    featured: true,
  },
  {
    id: 2,
    title: "อาหารที่แมวไม่ควรกิน: รายการอันตราย",
    excerpt: "รู้จักอาหารที่เป็นอันตรายต่อแมว และวิธีการป้องกันการกินอาหารที่ไม่เหมาะสม พร้อมคำแนะนำเมื่อเกิดเหตุฉุกเฉิน",
    content: "แมวเป็นสัตว์ที่มีระบบย่อยอาหารที่แตกต่างจากมนุษย์ อาหารบางประเภทที่ปลอดภัยสำหรับเราอาจเป็นอันตรายต่อแมว...",
    date: "2024-06-12",
    author: "ดร.มาลี รักแมว",
    category: "โภชนาการ",
    tags: ["แมว", "อาหาร", "ความปลอดภัย"],
    image: "/placeholder.svg?height=200&width=300",
    readTime: "7 นาที",
    views: 987,
  },
  {
    id: 3,
    title: "การฝึกสุนัขให้เชื่อฟัง: เริ่มต้นอย่างไร",
    excerpt: "คู่มือเบื้องต้นสำหรับการฝึกสุนัขให้เชื่อฟัง ด้วยวิธีการที่ถูกต้องและมีประสิทธิภาพ พร้อมเทคนิคจากผู้เชี่ยวชาญ",
    content: "การฝึกสุนัขให้เชื่อฟังเป็นสิ่งสำคัญที่จะช่วยให้การอยู่ร่วมกันเป็นไปอย่างมีความสุข เริ่มต้นด้วยการสร้างความสัมพันธ์ที่ดี...",
    date: "2024-06-10",
    author: "อาจารย์สมศักดิ์ ฝึกสุนัข",
    category: "การฝึก",
    tags: ["สุนัข", "การฝึก", "พฤติกรรม"],
    image: "/placeholder.svg?height=200&width=300",
    readTime: "10 นาที",
    views: 1567,
  },
  {
    id: 4,
    title: "วิธีเลือกอาหารสุนัขที่เหมาะสมกับอายุ",
    excerpt: "แนวทางการเลือกอาหารสุนัขตามช่วงอายุ ตั้งแต่ลูกสุนัข สุนัขวัยรุ่น ไปจนถึงสุนัขสูงอายุ",
    content: "อาหารเป็นปัจจัยสำคัญต่อสุขภาพของสุนัข การเลือกอาหารที่เหมาะสมกับอายุจะช่วยให้สุนัขได้รับสารอาหารที่เพียงพอ...",
    date: "2024-06-08",
    author: "ดร.วิทยา อาหารสัตว์",
    category: "โภชนาการ",
    tags: ["สุนัข", "อาหาร", "โภชนาการ"],
    image: "/placeholder.svg?height=200&width=300",
    readTime: "8 นาที",
    views: 856,
  },
  {
    id: 5,
    title: "การดูแลแมวหลังการทำหมัน: คำแนะนำสำคัญ",
    excerpt: "วิธีการดูแลแมวหลังการผ่าตัดทำหมัน เพื่อให้หายเร็วและไม่เกิดภาวะแทรกซ้อน",
    content: "การทำหมันเป็นการผ่าตัดที่สำคัญ การดูแลหลังผ่าตัดที่ถูกต้องจะช่วยให้แมวหายเร็วและลดความเสี่ยงต่อการติดเชื้อ...",
    date: "2024-06-05",
    author: "ดร.นิตยา สัตวแพทย์",
    category: "การรักษา",
    tags: ["แมว", "การผ่าตัด", "การดูแล"],
    image: "/placeholder.svg?height=200&width=300",
    readTime: "6 นาที",
    views: 1123,
  },
  {
    id: 6,
    title: "โรคผิวหนังในสุนัข: สาเหตุและการรักษา",
    excerpt: "ปัญหาผิวหนังที่พบบ่อยในสุนัข สาเหตุที่เกิดขึ้น และวิธีการรักษาที่ถูกต้อง",
    content: "โรคผิวหนังเป็นปัญหาที่พบบ่อยในสุนัข อาจเกิดจากหลายสาเหตุ ตั้งแต่การแพ้ เชื้อโรค หรือปัจจัยสิ่งแวดล้อม...",
    date: "2024-06-03",
    author: "ดร.สมพงษ์ ผิวหนัง",
    category: "การรักษา",
    tags: ["สุนัข", "ผิวหนัง", "โรค"],
    image: "/placeholder.svg?height=200&width=300",
    readTime: "9 นาที",
    views: 734,
  },
  {
    id: 7,
    title: "การเตรียมตัวสำหรับการรับเลี้ยงแมวใหม่",
    excerpt: "สิ่งที่ต้องเตรียมและรู้ก่อนการรับเลี้ยงแมวใหม่ เพื่อให้ทั้งคุณและแมวมีความสุข",
    content: "การรับเลี้ยงแมวใหม่เป็นเรื่องที่น่าตื่นเต้น แต่ต้องมีการเตรียมตัวที่ดี ทั้งด้านสิ่งของและจิตใจ...",
    date: "2024-06-01",
    author: "คุณสมหญิง รักแมว",
    category: "การดูแล",
    tags: ["แมว", "การเลี้ยง", "เริ่มต้น"],
    image: "/placeholder.svg?height=200&width=300",
    readTime: "12 นาที",
    views: 892,
  },
  {
    id: 8,
    title: "วิตามินและแร่ธาตุสำหรับสัตว์เลี้ยง",
    excerpt: "ความสำคัญของวิตามินและแร่ธาตุต่อสุขภาพสัตว์เลี้ยง และการเลือกอาหารเสริมที่เหมาะสม",
    content: "วิตามินและแร่ธาตุเป็นสารอาหารที่จำเป็นต่อการทำงานของร่างกายสัตว์เลี้ยง การได้รับไม่เพียงพออาจส่งผลต่อสุขภาพ...",
    date: "2024-05-29",
    author: "ดร.อรุณ โภชนาการ",
    category: "โภชนาการ",
    tags: ["วิตามิน", "แร่ธาตุ", "สุขภาพ"],
    image: "/placeholder.svg?height=200&width=300",
    readTime: "11 นาที",
    views: 645,
  },
]

const categories = ["ทั้งหมด", "การดูแล", "โภชนาการ", "การฝึก", "การรักษา"]

const allTags = Array.from(new Set(articles.flatMap((article) => article.tags)))

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด")
  const [selectedTag, setSelectedTag] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 6

  // Filter articles
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "ทั้งหมด" || article.category === selectedCategory
      const matchesTag = selectedTag === "" || article.tags.includes(selectedTag)

      return matchesSearch && matchesCategory && matchesTag
    })
  }, [searchTerm, selectedCategory, selectedTag])

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage)
  const startIndex = (currentPage - 1) * articlesPerPage
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage)

  // Featured article
  const featuredArticle = articles.find((article) => article.featured)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-coral-500 text-black to-coral-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl lg:text-3xl font-bold text-gray-900 mb-4">บทความและเคล็ดลับ</h1>
            <p className="text-2l text-gray-600">
              ความรู้และเคล็ดลับในการดูแลสัตว์เลี้ยงจากผู้เชี่ยวชาญ เพื่อให้เพื่อนขนปุยของคุณมีสุขภาพดี
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-coral-500 to-teal-500 rounded-2xl overflow-hidden shadow-lg">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="p-8 lg:p-12 text-white">
                  <Badge className="bg-white/20 text-white mb-4">Featured</Badge>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-4">{featuredArticle.title}</h2>
                  <p className="text-white/90 mb-6">{featuredArticle.excerpt}</p>
                  <div className="flex items-center gap-4 text-white/80 text-sm mb-6">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{featuredArticle.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(featuredArticle.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{featuredArticle.readTime}</span>
                    </div>
                  </div>
                  <Button className="bg-white text-coral-500 hover:bg-gray-100">
                    อ่านเพิ่มเติม
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="relative h-64 lg:h-96">
                  <Image
                    src={featuredArticle.image || "/placeholder.svg"}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="ค้นหาบทความ..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div>
              <select
                value={selectedTag}
                onChange={(e) => {
                  setSelectedTag(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral-500"
              >
                <option value="">แท็กทั้งหมด</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">พบ {filteredArticles.length} บทความ</div>
        </div>

        {/* Articles Grid */}
        {paginatedArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {paginatedArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                {/* Article Image */}
                <div className="relative overflow-hidden h-48">
                  <Image
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-coral-500">{article.category}</Badge>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(article.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-coral-500 transition-colors line-clamp-2">
                    <Link href={`/blog/${article.id}`}>{article.title}</Link>
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Author and Views */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{article.author}</span>
                    </div>
                    <span>{article.views.toLocaleString()} ครั้ง</span>
                  </div>

                  <Link href={`/blog/${article.id}`}>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-coral-50 group-hover:border-coral-500 group-hover:text-coral-600"
                    >
                      อ่านเพิ่มเติม
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบบทความที่ค้นหา</h3>
            <p className="text-gray-600">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
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
  )
}
