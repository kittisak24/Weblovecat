import { Heart, Stethoscope, ShoppingBag, GraduationCap, Home, ArrowRight } from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: Heart,
    title: "การดูแลสัตว์เลี้ยง",
    description: "บริการดูแลสัตว์เลี้ยงแบบครบวงจร ด้วยความรักและใส่ใจในทุกรายละเอียด",
    color: "text-coral-500 bg-coral-100",
  },
  {
    icon: Stethoscope,
    title: "คลินิกสัตวแพทย์",
    description: "ตรวจสุขภาพ รักษาพยาบาล และให้คำปรึกษาโดยสัตวแพทย์ผู้เชี่ยวชาญ",
    color: "text-teal-500 bg-teal-100",
  },
  {
    icon: ShoppingBag,
    title: "อาหารและอุปกรณ์",
    description: "อาหารคุณภาพสูงและอุปกรณ์ครบครันสำหรับสัตว์เลี้ยงทุกประเภท",
    color: "text-purple-500 bg-purple-100",
  },
  {
    icon: GraduationCap,
    title: "การฝึกอบรม",
    description: "ฝึกพฤติกรรมและการเชื่อฟังด้วยวิธีการที่เหมาะสมและมีประสิทธิภาพ",
    color: "text-blue-500 bg-blue-100",
  },
  {
    icon: Home,
    title: "บริการรับฝาก",
    description: "รับฝากสัตว์เลี้ยงในสภาพแวดล้อมที่ปลอดภัยและเต็มไปด้วยความรัก",
    color: "text-green-500 bg-green-100",
  },
]

export default function Services() {
  return (
    <section id="services" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">บริการของเรา</h2>
          <p className="text-2l text-gray-600">
            เราให้บริการดูแลสัตว์เลี้ยงแบบครบวงจร ด้วยทีมผู้เชี่ยวชาญที่มีประสบการณ์และความรักในสัตว์
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-coral-200"
            >
              <div className={`inline-flex p-3 rounded-lg ${service.color} mb-6`}>
                <service.icon className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.title}</h3>

              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

              <Link
                href="/services"
                className="inline-flex items-center text-coral-500 hover:text-coral-600 font-medium group-hover:translate-x-1 transition-transform"
              >
                เรียนรู้เพิ่มเติม
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
