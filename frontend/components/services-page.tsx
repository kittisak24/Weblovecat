"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, MapPin, Phone, Heart, Stethoscope, Scissors, Home, GraduationCap, Sparkles } from "lucide-react"
import Image from "next/image"
import BookingModal from "@/components/booking-modal"

const services = [
  {
    id: 1,
    name: "บริการตัดแต่งขน",
    icon: Scissors,
    description: "บริการตัดแต่งขนสัตว์เลี้ยงด้วยเทคนิคมืออาชีพ ทำให้น้องหมาน้องแมวของคุณดูสวยงามและสะอาด",
    fullDescription:
      "บริการตัดแต่งขนครบวงจร ตั้งแต่การอาบน้ำ ตัดขน จัดแต่งทรง ตัดเล็บ ทำความสะอาดหู และสปาผ่อนคลาย ด้วยผู้เชี่ยวชาญที่มีประสบการณ์กว่า 10 ปี",
    price: "฿300 - ฿1,500",
    duration: "1-3 ชั่วโมง",
    rating: 4.9,
    reviews: 245,
    image: "/placeholder.svg?height=300&width=400",
    features: ["อาบน้ำด้วยแชมพูพิเศษ", "ตัดแต่งขนตามต้องการ", "ตัดเล็บ", "ทำความสะอาดหู", "สปาผ่อนคลาย"],
    popular: true,
  },
  {
    id: 2,
    name: "คลินิกสัตวแพทย์",
    icon: Stethoscope,
    description: "ตรวจสุขภาพ รักษาพยาบาล และให้คำปรึกษาโดยสัตวแพทย์ผู้เชี่ยวชาญ พร้อมอุปกรณ์ทันสมัย",
    fullDescription:
      "บริการทางการแพทย์ครบครัน ตั้งแต่การตรวจสุขภาพประจำปี การฉีดวัคซีน การรักษาโรค การผ่าตัด และการดูแลฟื้นฟู ด้วยทีมสัตวแพทย์มืออาชีพ",
    price: "฿500 - ฿5,000",
    duration: "30 นาที - 3 ชั่วโมง",
    rating: 4.8,
    reviews: 189,
    image: "/placeholder.svg?height=300&width=400",
    features: ["ตรวจสุขภาพทั่วไป", "ฉีดวัคซีน", "รักษาโรคต่างๆ", "การผ่าตัด", "เอ็กซเรย์และแลป"],
    emergency: true,
  },
  {
    id: 3,
    name: "บริการรับฝากสัตว์เลี้ยง",
    icon: Home,
    description: "รับฝากสัตว์เลี้ยงในสภาพแวดล้อมที่ปลอดภัย อบอุ่น และมีการดูแลตลอด 24 ชั่วโมง",
    fullDescription:
      "โรงแรมสัตว์เลี้ยงระดับพรีเมี่ยม พร้อมห้องพักที่สะอาด ปลอดภัย และสะดวกสบาย มีการดูแลตลอด 24 ชั่วโมง พร้อมกิจกรรมออกกำลังกายและเล่นสนุก",
    price: "฿500 - ฿1,200/วัน",
    duration: "1 วัน - หลายเดือน",
    rating: 4.7,
    reviews: 156,
    image: "/placeholder.svg?height=300&width=400",
    features: ["ห้องพักส่วนตัว", "อาหารคุณภาพสูง", "ออกกำลังกายทุกวัน", "ดูแล 24 ชั่วโมง", "รายงานสถานะทุกวัน"],
  },
  {
    id: 4,
    name: "การฝึกพฤติกรรม",
    icon: GraduationCap,
    description: "ฝึกพฤติกรรมและการเชื่อฟังสัตว์เลี้ยงด้วยวิธีการที่เหมาะสมและมีประสิทธิภาพ",
    fullDescription:
      "หลักสูตรการฝึกพฤติกรรมสัตว์เลี้ยงโดยผู้เชี่ยวชาญ ครอบคลุมตั้งแต่การฝึกขั้นพื้นฐาน การแก้ไขพฤติกรรมที่ไม่พึงประสงค์ จนถึงการฝึกเทคนิคขั้นสูง",
    price: "฿800 - ฿2,500",
    duration: "1-8 สัปดาห์",
    rating: 4.6,
    reviews: 98,
    image: "/placeholder.svg?height=300&width=400",
    features: ["ฝึกพื้นฐาน", "แก้ไขพฤติกรรม", "ฝึกเทคนิคพิเศษ", "คอร์สส่วนตัว", "ติดตามผลลัพธ์"],
  },
  {
    id: 5,
    name: "ทำความสะอาดฟัน",
    icon: Sparkles,
    description: "บริการทำความสะอาดฟันและดูแลสุขภาพช่องปากสัตว์เลี้ยงอย่างปลอดภัย",
    fullDescription:
      "บริการดูแลสุขภาพช่องปากครบครัน ทำความสะอาดหินปูน ตรวจสอบเหงือก และให้คำแนะนำการดูแลฟันที่บ้าน เพื่อป้องกันโรคฟันและเหงือก",
    price: "฿800 - ฿2,000",
    duration: "1-2 ชั่วโมง",
    rating: 4.5,
    reviews: 134,
    image: "/placeholder.svg?height=300&width=400",
    features: ["ตรวจสุขภาพช่องปาก", "ขูดหินปูน", "ขัดฟัน", "ตรวจเหงือก", "คำแนะนำการดูแล"],
  },
  {
    id: 6,
    name: "สปาสัตว์เลี้ยง",
    icon: Heart,
    description: "บริการสปาผ่อนคลายพิเศษเพื่อความสุขและความสวยงามของสัตว์เลี้ยงที่คุณรัก",
    fullDescription:
      "บริการสปาครบครัน ตั้งแต่การนวดผ่อนคลาย บำรุงขนและผิวหนัง อโรมาเธราปี และทรีตเม้นต์พิเศษ เพื่อให้สัตว์เลี้ยงได้รับการผ่อนคลายและดูแลที่ดีที่สุด",
    price: "฿600 - ฿1,800",
    duration: "1.5-3 ชั่วโมง",
    rating: 4.8,
    reviews: 87,
    image: "/placeholder.svg?height=300&width=400",
    features: ["นวดผ่อนคลาย", "บำรุงขนและผิว", "อโรมาเธราปี", "ทรีตเม้นต์พิเศษ", "บรรยากาศสบาย"],
    new: true,
  },
]

export default function ServicesPage() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<string>("")

  const handleBookService = (serviceName: string) => {
    setSelectedService(serviceName)
    setIsBookingModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-coral-500 text-black to-coral-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl lg:text-3xl font-bold text-gray-900 mb-4">บริการทั้งหมด</h1>
            <p className="text-2l text-gray-600">
              บริการดูแลสัตว์เลี้ยงครบวงจร ด้วยความรักและความเชี่ยวชาญกว่า 10 ปี
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Service Image */}
              <div className="relative overflow-hidden h-48">
                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={service.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {service.popular && <Badge className="bg-coral-500">ยอดนิยม</Badge>}
                  {service.new && <Badge className="bg-green-500">ใหม่</Badge>}
                  {service.emergency && <Badge className="bg-red-500">24/7</Badge>}
                </div>
              </div>

              {/* Service Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-coral-100 rounded-lg">
                    <service.icon className="h-5 w-5 text-coral-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{service.rating}</span>
                  </div>
                  <span className="text-sm text-gray-400">({service.reviews} รีวิว)</span>
                </div>

                {/* Service Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-coral-600">
                    <span>{service.price}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">รายละเอียดบริการ:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-coral-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                    {service.features.length > 3 && (
                      <li className="text-coral-500 text-xs">และอีก {service.features.length - 3} รายการ</li>
                    )}
                  </ul>
                </div>

                {/* Book Button */}
                <Button
                  className="w-full bg-coral-500 hover:bg-coral-600 text-white"
                  onClick={() => handleBookService(service.name)}
                >
                  จองบริการนี้
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-16 bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">ติดต่อสอบถามเพิ่มเติม</h2>
            <p className="text-gray-600">หากต้องการคำปรึกษาเกี่ยวกับบริการ หรือมีคำถามพิเศษ ติดต่อเราได้ทันที</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex p-3 bg-coral-100 rounded-full mb-3">
                <Phone className="h-6 w-6 text-coral-500" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">โทรศัพท์</h3>
              <p className="text-gray-600">02-123-4567</p>
            </div>
            <div className="text-center">
              <div className="inline-flex p-3 bg-teal-100 rounded-full mb-3">
                <MapPin className="h-6 w-6 text-teal-500" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">ที่ตั้ง</h3>
              <p className="text-gray-600">123 ถนนรักสัตว์ เขตบางรัก กรุงเทพฯ</p>
            </div>
            <div className="text-center">
              <div className="inline-flex p-3 bg-purple-100 rounded-full mb-3">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">เวลาทำการ</h3>
              <p className="text-gray-600">จันทร์-อาทิตย์ 9:00-18:00</p>
            </div>
          </div>
        </div>
      </div>

      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </div>
  )
}
