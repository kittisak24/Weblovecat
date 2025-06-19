import { Heart, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react"
import Link from "next/link"

const footerLinks = {
  services: [
    { name: "การดูแลสัตว์เลี้ยง", href: "#" },
    { name: "คลินิกสัตวแพทย์", href: "#" },
    { name: "อาหารและอุปกรณ์", href: "#" },
    { name: "การฝึกอบรม", href: "#" },
    { name: "บริการรับฝาก", href: "#" },
  ],
  company: [
    { name: "เกี่ยวกับเรา", href: "#" },
    { name: "ทีมงาน", href: "#" },
    { name: "ข่าวสาร", href: "#" },
    { name: "ร่วมงานกับเรา", href: "#" },
    { name: "ติดต่อเรา", href: "#" },
  ],
  support: [
    { name: "ศูนย์ช่วยเหลือ", href: "#" },
    { name: "คำถามที่พบบ่อย", href: "#" },
    { name: "นโยบายความเป็นส่วนตัว", href: "#" },
    { name: "เงื่อนไขการใช้งาน", href: "#" },
    { name: "การรับประกัน", href: "#" },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <Heart className="h-8 w-8 text-coral-500 mr-2" />
              <span className="text-2xl font-bold">We Love Pet</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              เราให้ความรักและดูแลสัตว์เลี้ยงของคุณเหมือนครอบครัว ด้วยบริการครบวงจรและทีมผู้เชี่ยวชาญที่มีประสบการณ์มากกว่า 10 ปี
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-coral-500" />
                <span className="text-gray-300">02-123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-coral-500" />
                <span className="text-gray-300">info@welovepet.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-coral-500" />
                <span className="text-gray-300">123 ถนนรักสัตว์ เขตบางรัก กรุงเทพฯ 10500</span>
              </div>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">บริการของเรา</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-300 hover:text-coral-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">บริษัท</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-300 hover:text-coral-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">ช่วยเหลือ</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-300 hover:text-coral-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} We Love Pet. สงวนลิขสิทธิ์ทุกประการ</p>

            {/* Social Media */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">ติดตามเรา:</span>
              <div className="flex gap-3">
                <Link href="#" className="p-2 bg-gray-800 rounded-full hover:bg-coral-500 transition-colors">
                  <Facebook className="h-4 w-4" />
                </Link>
                <Link href="#" className="p-2 bg-gray-800 rounded-full hover:bg-coral-500 transition-colors">
                  <Instagram className="h-4 w-4" />
                </Link>
                <Link href="#" className="p-2 bg-gray-800 rounded-full hover:bg-coral-500 transition-colors">
                  <Twitter className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
