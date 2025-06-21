import { Shield, Clock, Award, Heart, Users, Headphones } from "lucide-react"
import Image from "next/image"

const features = [
  {
    icon: Award,
    title: "ประสบการณ์มากกว่า 10 ปี",
    description: "ทีมผู้เชี่ยวชาญที่มีประสบการณ์ยาวนานในการดูแลสัตว์เลี้ยง",
  },
  {
    icon: Shield,
    title: "มาตรฐานระดับสากล",
    description: "บริการที่ได้รับการรับรองมาตรฐานสากลและใบอนุญาตครบถ้วน",
  },
  {
    icon: Clock,
    title: "บริการ 24/7",
    description: "พร้อมให้บริการและคำปรึกษาตลอด 24 ชั่วโมง ทุกวันในสัปดาห์",
  },
  {
    icon: Heart,
    title: "ดูแลด้วยความรัก",
    description: "เราดูแลสัตว์เลี้ยงของคุณด้วยความรักเหมือนเป็นครอบครัวของเราเอง",
  },
  {
    icon: Users,
    title: "ทีมผู้เชี่ยวชาญ",
    description: "สัตวแพทย์และผู้ดูแลที่ผ่านการฝึกอบรมและมีใจรักสัตว์",
  },
  {
    icon: Headphones,
    title: "ซัพพอร์ตตลอดเวลา",
    description: "ทีมซัพพอร์ตพร้อมให้คำปรึกษาและช่วยเหลือทุกเมื่อที่คุณต้องการ",
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">ทำไมต้องเลือกเรา</h2>
          <p className="text-2l text-gray-600">
            เราคือผู้นำด้านการดูแลสัตว์เลี้ยงที่ได้รับความไว้วางใจจากเจ้าของสัตว์เลี้ยงมากกว่า 5,000 ครอบครัว
          </p>
        </div>

        <div className="space-y-20">
          {/* First Feature Row */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                {features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="space-y-3">
                    <div className="inline-flex p-3 rounded-lg bg-coral-100">
                      <feature.icon className="h-6 w-6 text-coral-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Image
                src="/istockphoto001.jpg?height=500&width=600"
                alt="Professional pet care team"
                width={600}
                height={500}
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* Second Feature Row */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative lg:order-first">
              <Image
                src="/pngtree-a-siamese-cat.jpg?height=500&width=600"
                alt="Happy pets in our care"
                width={600}
                height={500}
                className="rounded-2xl shadow-lg"
              />
            </div>

            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                {features.slice(4, 6).map((feature, index) => (
                  <div key={index} className="space-y-3">
                    <div className="inline-flex p-3 rounded-lg bg-teal-100">
                      <feature.icon className="h-6 w-6 text-teal-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-coral-500">5,000+</div>
                  <div className="text-sm text-gray-600">ลูกค้าที่ไว้วางใจ</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-500">4.9/5</div>
                  <div className="text-sm text-gray-600">คะแนนรีวิว</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">10+</div>
                  <div className="text-sm text-gray-600">ปีประสบการณ์</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
