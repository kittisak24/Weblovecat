import { Button } from "@/components/ui/button"
import { Star, Users, Award, Heart } from "lucide-react"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-coral-50 to-teal-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                เราให้ความรักและ
                <span className="text-coral-500"> ดูแลสัตว์เลี้ยง</span>
                ของคุณเหมือนครอบครัว
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                บริการดูแลสัตว์เลี้ยงครบวงจร ด้วยทีมผู้เชี่ยวชาญและความรักที่แท้จริง เพื่อให้เพื่อนขนปุยของคุณมีความสุขและสุขภาพดีเสมอ
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-coral-500 hover:bg-coral-600 text-white px-8 py-4 text-lg">
                จองบริการวันนี้
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-teal-500 text-teal-600 hover:bg-teal-50 px-8 py-4 text-lg"
              >
                ดูสินค้าทั้งหมด
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-8 pt-8">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-coral-500" />
                <span className="text-sm text-gray-600">
                  ลูกค้ามากกว่า <strong>5,000+</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600">
                  รีวิว <strong>4.9/5</strong> ดาว
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-teal-500" />
                <span className="text-sm text-gray-600">
                  ประสบการณ์ <strong>10+</strong> ปี
                </span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Happy pets with their owners"
                width={500}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-lg">
              <Heart className="h-8 w-8 text-coral-500 fill-current" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
