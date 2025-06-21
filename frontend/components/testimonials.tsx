"use client"

import { useState } from "react"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "คุณสมใจ วงศ์ใหญ่",
    role: "เจ้าของแมวพันธุ์สก๊อตติชโฟลด์",
    content: "บริการดีมาก ทีมงานใส่ใจและรักสัตว์จริงๆ น้องหมาของเราได้รับการดูแลอย่างดีเยี่ยม กลับมาแล้วดูมีความสุขมาก แนะนำเลยค่ะ",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
    petImage: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "คุณวิทยา ศรีสุข",
    role: "เจ้าของแมวเปอร์เซีย",
    content: "ประทับใจมากค่ะ สัตวแพทย์ให้คำปรึกษาดี อธิบายละเอียด น้องแมวป่วยหายเร็วมาก ราคาสมเหตุสมผล จะมาใช้บริการอีกแน่นอน",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
    petImage: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "คุณอนุชา ทองดี",
    role: "เจ้าของแมวพันธุ์ผสม",
    content: "ใช้บริการรับฝากแมวตอนไปเที่ยว กลับมาน้องหมาดูมีความสุข ไม่เครียด เห็นได้ว่าได้รับการดูแลดีจริงๆ ขอบคุณมากครับ",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
    petImage: "/placeholder.svg?height=100&width=100",
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-coral-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">ลูกค้าพูดถึงเรา</h2>
          <p className="text-2l text-gray-600">ฟังเสียงจากลูกค้าที่ไว้วางใจให้เราดูแลสัตว์เลี้ยงที่รักของพวกเขา</p>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 relative">
            <Quote className="absolute top-6 left-6 h-8 w-8 text-coral-200" />

            <div className="grid lg:grid-cols-3 gap-8 items-center">
              {/* Customer Info */}
              <div className="text-center lg:text-left">
                <div className="flex justify-center lg:justify-start mb-4">
                  <Image
                    src={currentTestimonial.image || "/placeholder.svg"}
                    alt={currentTestimonial.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{currentTestimonial.name}</h3>
                <p className="text-gray-600 mb-4">{currentTestimonial.role}</p>

                {/* Rating */}
                <div className="flex justify-center lg:justify-start gap-1 mb-4">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              {/* Testimonial Content */}
              <div className="lg:col-span-2">
                <blockquote className="text-lg text-gray-700 leading-relaxed mb-6">
                  "{currentTestimonial.content}"
                </blockquote>

                {/* Pet Image */}
                <div className="flex justify-center lg:justify-start">
                  <Image
                    src={currentTestimonial.petImage || "/placeholder.svg"}
                    alt="Customer's pet"
                    width={100}
                    height={100}
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <Button variant="outline" size="sm" onClick={prevTestimonial} className="rounded-full p-2">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextTestimonial} className="rounded-full p-2">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-coral-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
