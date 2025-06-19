import { Button } from "@/components/ui/button"
import { Star, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "อาหารสุนัขพรีเมี่ยม",
    price: "฿1,299",
    originalPrice: "฿1,499",
    rating: 4.8,
    reviews: 124,
    image: "/placeholder.svg?height=300&width=300",
    badge: "ขายดี",
  },
  {
    id: 2,
    name: "ของเล่นแมวอินเตอร์แอคทีฟ",
    price: "฿599",
    rating: 4.9,
    reviews: 89,
    image: "/placeholder.svg?height=300&width=300",
    badge: "ใหม่",
  },
  {
    id: 3,
    name: "บ้านสุนัขกันน้ำ",
    price: "฿2,499",
    originalPrice: "฿2,999",
    rating: 4.7,
    reviews: 67,
    image: "/placeholder.svg?height=300&width=300",
    badge: "ลดราคา",
  },
  {
    id: 4,
    name: "ปลอกคอแมวแฟชั่น",
    price: "฿299",
    rating: 4.6,
    reviews: 156,
    image: "/placeholder.svg?height=300&width=300",
  },
]

export default function FeaturedProducts() {
  return (
    <section id="products" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">สินค้าขายดี</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">สินค้าคุณภาพสูงที่ได้รับความนิยมจากเจ้าของสัตว์เลี้ยงทั่วประเทศ</p>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        product.badge === "ขายดี"
                          ? "bg-coral-500 text-white"
                          : product.badge === "ใหม่"
                            ? "bg-green-500 text-white"
                            : "bg-orange-500 text-white"
                      }`}
                    >
                      {product.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-coral-500 transition-colors">
                  {product.name}
                </h3>

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
                  <span className="text-xl font-bold text-gray-900">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <Button className="w-full bg-coral-500 hover:bg-coral-600 text-white">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  เพิ่มใส่ตะกร้า
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products Link */}
        <div className="text-center">
          <Link href="#">
            <Button variant="outline" size="lg" className="border-coral-500 text-coral-600 hover:bg-coral-50">
              ดูสินค้าทั้งหมด
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
