import { Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

const articles = [
  {
    id: 1,
    title: "5 วิธีดูแลแมวในหน้าร้อนให้ปลอดภัย",
    excerpt: "เคล็ดลับการดูแลแมวในช่วงอากาศร้อน เพื่อป้องกันอาการเป็นลมและปัญหาสุขภาพอื่นๆ",
    date: "15 มิถุนายน 2024",
    category: "การดูแล",
    image: "/481769428.jpg?height=200&width=300",
    readTime: "5 นาที",
  },
  {
    id: 2,
    title: "อาหารที่แมวไม่ควรกิน: รายการอันตราย",
    excerpt: "รู้จักอาหารที่เป็นอันตรายต่อแมว และวิธีการป้องกันการกินอาหารที่ไม่เหมาะสม",
    date: "12 มิถุนายน 2024",
    category: "โภชนาการ",
    image: "/73.jpg?height=200&width=300",
    readTime: "7 นาที",
  },
  {
    id: 3,
    title: "การฝึกแมวให้เชื่อฟัง: เริ่มต้นอย่างไร",
    excerpt: "คู่มือเบื้องต้นสำหรับการฝึกแมวให้เชื่อฟัง ด้วยวิธีการที่ถูกต้องและมีประสิทธิภาพ",
    date: "10 มิถุนายน 2024",
    category: "การฝึก",
    image: "/PracticeCat01.jpg?height=200&width=300",
    readTime: "10 นาที",
  },
]

export default function BlogSection() {
  return (
    <section id="blog" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">บทความและเคล็ดลับ</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ความรู้และเคล็ดลับในการดูแลสัตว์เลี้ยงจากผู้เชี่ยวชาญ เพื่อให้เพื่อนขนปุยของคุณมีสุขภาพดี
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              {/* Article Image */}
              <div className="relative overflow-hidden">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-coral-500 text-white px-3 py-1 text-xs font-medium rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{article.date}</span>
                  </div>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-coral-500 transition-colors">
                  <Link href="#">{article.title}</Link>
                </h3>

                <p className="text-gray-600 mb-4 leading-relaxed">{article.excerpt}</p>

                <Link
                  href="#"
                  className="inline-flex items-center text-coral-500 hover:text-coral-600 font-medium group-hover:translate-x-1 transition-transform"
                >
                  อ่านต่อ
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Articles Button */}
        <div className="text-center">
          <Link href="#">
            <Button variant="outline" size="lg" className="border-coral-500 text-coral-600 hover:bg-coral-50">
              ดูบทความทั้งหมด
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
