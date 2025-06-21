"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, MessageCircle, Heart } from "lucide-react"
import Image from "next/image"

const contactInfo = [
  {
    icon: MapPin,
    title: "ที่ตั้ง",
    details: "123 ถนนรักสัตว์ เขตบางรัก กรุงเทพฯ 10500",
    color: "text-coral-500 bg-coral-100",
  },
  {
    icon: Phone,
    title: "โทรศัพท์",
    details: "02-123-4567, 089-123-4567",
    color: "text-teal-500 bg-teal-100",
  },
  {
    icon: Mail,
    title: "อีเมล",
    details: "info@welovecat.com",
    color: "text-purple-500 bg-purple-100",
  },
  {
    icon: Clock,
    title: "เวลาทำการ",
    details: "จันทร์-อาทิตย์ 9:00-18:00",
    color: "text-blue-500 bg-blue-100",
  },
]

const socialMedia = [
  { icon: Facebook, name: "Facebook", url: "https://facebook.com/welovepet", color: "bg-blue-600" },
  { icon: Instagram, name: "Instagram", url: "https://instagram.com/welovepet", color: "bg-pink-600" },
  { icon: Twitter, name: "Twitter", url: "https://twitter.com/welovepet", color: "bg-blue-400" },
]

const inquiryTypes = [
  { value: "general", label: "สอบถามทั่วไป" },
  { value: "booking", label: "จองบริการ" },
  { value: "emergency", label: "เหตุฉุกเฉิน" },
  { value: "complaint", label: "ข้อร้องเรียน" },
  { value: "suggestion", label: "ข้อเสนอแนะ" },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiryType: "",
        subject: "",
        message: "",
      })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
       <div className="bg-gradient-to-br from-coral-500 text-black to-coral-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl lg:text-3xl font-bold text-gray-900 mb-4">ติดต่อเรา</h1>
            <p className="text-2l text-gray-600">พร้อมให้บริการและตอบคำถามทุกเรื่องเกี่ยวกับสัตว์เลี้ยงของคุณ</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">ข้อมูลติดต่อ</h2>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${info.color}`}>
                      <info.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                      <p className="text-gray-600 text-sm">{info.details}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">ติดตามเรา</h3>
                <div className="flex gap-3">
                  {socialMedia.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 ${social.color} text-white rounded-lg hover:opacity-90 transition-opacity`}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold text-red-900">เหตุฉุกเฉิน</h3>
                </div>
                <p className="text-red-700 text-sm mb-2">หากสัตว์เลี้ยงของคุณมีอาการฉุกเฉิน โทรหาเราทันทีที่</p>
                <p className="font-bold text-red-900">02-123-4567</p>
                <p className="text-red-600 text-xs mt-1">พร้อมให้บริการ 24 ชั่วโมง</p>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">แผนที่</h3>
              <div className="relative h-64 rounded-lg overflow-hidden bg-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d865.4526970065867!2d100.52378778992723!3d13.731231437167489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e298d2bce3562d%3A0x1c0100b579437dd0!2z4LmA4LiC4LiV4Lia4Liy4LiH4Lij4Lix4LiBIOC4geC4o-C4uOC4h-C5gOC4l-C4nuC4oeC4q-C4suC4meC4hOC4oyAxMDUwMA!5e0!3m2!1sth!2sth!4v1750407481439!5m2!1sth!2sth"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "100%", minWidth: "100%" }}
                  allowFullScreen
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 p-4 rounded-lg text-center">
                    <MapPin className="h-8 w-8 text-coral-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">We Love Cet</p>
                    <p className="text-xs text-gray-600">123 ถนนรักสัตว์</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="h-6 w-6 text-coral-500" />
                <h2 className="text-2xl font-bold text-gray-900">ส่งข้อความถึงเรา</h2>
              </div>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <Heart className="h-8 w-8 text-green-600 fill-current" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">ส่งข้อความสำเร็จ!</h3>
                  <p className="text-gray-600">เราได้รับข้อความของคุณแล้ว จะติดต่อกลับภายใน 24 ชั่วโมง</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">ชื่อ-นามสกุล *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="กรอกชื่อ-นามสกุล"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">อีเมล *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="example@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="08X-XXX-XXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inquiryType">ประเภทการสอบถาม *</Label>
                      <Select
                        value={formData.inquiryType}
                        onValueChange={(value) => handleInputChange("inquiryType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกประเภทการสอบถาม" />
                        </SelectTrigger>
                        <SelectContent>
                          {inquiryTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">หัวข้อ *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="หัวข้อที่ต้องการสอบถาม"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">ข้อความ *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="รายละเอียดที่ต้องการสอบถาม..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">การตอบกลับ:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• เราจะตอบกลับภายใน 24 ชั่วโมงในวันทำการ</li>
                      <li>• สำหรับเหตุฉุกเฉิน โปรดโทรศัพท์ 02-123-4567</li>
                      <li>• ข้อมูลของคุณจะถูกเก็บเป็นความลับ</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-coral-500 hover:bg-coral-600 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        กำลังส่ง...
                      </>
                    ) : (
                      "ส่งข้อความ"
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* FAQ Section */}
            <div className="mt-8 bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">คำถามที่พบบ่อย</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-coral-500 pl-4">
                  <h4 className="font-medium text-gray-900">ต้องจองบริการล่วงหน้าหรือไม่?</h4>
                  <p className="text-sm text-gray-600 mt-1">แนะนำให้จองล่วงหน้า 1-2 วัน สำหรับบริการฉุกเฉินรับได้ทันที</p>
                </div>
                <div className="border-l-4 border-teal-500 pl-4">
                  <h4 className="font-medium text-gray-900">มีบริการรับส่งสัตว์เลี้ยงหรือไม่?</h4>
                  <p className="text-sm text-gray-600 mt-1">มีบริการรับส่งในเขตกรุงเทพและปริมณฑล (คิดค่าบริการแยกต่างหาก)</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium text-gray-900">ยกเลิกการจองได้หรือไม่?</h4>
                  <p className="text-sm text-gray-600 mt-1">สามารถยกเลิกได้ล่วงหน้า 24 ชั่วโมง โดยไม่มีค่าใช้จ่าย</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
