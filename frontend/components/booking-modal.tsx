"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Heart, Phone, Mail, User, PawPrint } from "lucide-react"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  service?: {
    id: number
    name: string
    // ...other fields as needed
  } | null
}

const services = [
  { value: "grooming", label: "บริการตัดแต่งขน" },
  { value: "veterinary", label: "ตรวจสุขภาพสัตวแพทย์" },
  { value: "boarding", label: "บริการรับฝากสัตว์เลี้ยง" },
  { value: "training", label: "ฝึกพฤติกรรมสัตว์เลี้ยง" },
  { value: "vaccination", label: "ฉีดวัคซีน" },
  { value: "dental", label: "ทำความสะอาดฟัน" },
  { value: "spa", label: "สปาสัตว์เลี้ยง" },
]

const petTypes = [
  { value: "dog", label: "สุนัข" },
  { value: "cat", label: "แมว" },
  { value: "bird", label: "นก" },
  { value: "rabbit", label: "กระต่าย" },
  { value: "hamster", label: "หนูแฮมสเตอร์" },
  { value: "other", label: "อื่นๆ" },
]

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]

export default function BookingModal({ isOpen, onClose, service }: BookingModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    petName: "",
    petType: "",
    service: service?.name || "",
    date: "",
    time: "",
    notes: "",
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

    // Reset form after 3 seconds and close modal
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        petName: "",
        petType: "",
        service: "",
        date: "",
        time: "",
        notes: "",
      })
      onClose()
    }, 3000)
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  // Autofill service name if prop changes
  useEffect(() => {
    if (service?.name) {
      setFormData((prev) => ({ ...prev, service: service.name }))
    }
  }, [service])

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Heart className="h-8 w-8 text-green-600 fill-current" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">จองบริการสำเร็จ!</h3>
            <p className="text-gray-600 mb-4">เราได้รับการจองของคุณแล้ว ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง</p>
            <div className="bg-coral-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-coral-700">
                <strong>หมายเลขการจอง:</strong> #BK{Date.now().toString().slice(-6)}
              </p>
            </div>
            <Button onClick={onClose} className="bg-coral-500 hover:bg-coral-600">
              ปิด
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <PawPrint className="h-6 w-6 text-coral-500" />
            {service?.name ? `จองบริการ: ${service.name}` : "จองบริการดูแลสัตว์เลี้ยง"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-coral-500" />
              ข้อมูลผู้จอง
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">ชื่อ *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="กรอกชื่อ"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">นามสกุล *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="กรอกนามสกุล"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  เบอร์โทรศัพท์ *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="08X-XXX-XXXX"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  อีเมล *
                </Label>
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
          </div>

          {/* Pet Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Heart className="h-5 w-5 text-coral-500" />
              ข้อมูลสัตว์เลี้ยง
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="petName">ชื่อสัตว์เลี้ยง *</Label>
                <Input
                  id="petName"
                  value={formData.petName}
                  onChange={(e) => handleInputChange("petName", e.target.value)}
                  placeholder="ชื่อน้องหมา/น้องแมว"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="petType">ประเภทสัตว์เลี้ยง *</Label>
                <Select value={formData.petType} onValueChange={(value) => handleInputChange("petType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภทสัตว์เลี้ยง" />
                  </SelectTrigger>
                  <SelectContent>
                    {petTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-coral-500" />
              รายละเอียดการจอง
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service">บริการที่ต้องการ *</Label>
                <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)} disabled={!!service?.name}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกบริการ" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s.value} value={s.label}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">วันที่จอง *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    min={getTomorrowDate()}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    เวลา *
                  </Label>
                  <Select value={formData.time} onValueChange={(value) => handleInputChange("time", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกเวลา" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time} น.
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">หมายเหตุเพิ่มเติม</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="ระบุข้อมูลเพิ่มเติม เช่น อาการของสัตว์เลี้ยง, ความต้องการพิเศษ"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Terms and Submit */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">ข้อมูลสำคัญ:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• ทีมงานจะติดต่อกลับเพื่อยืนยันการจองภายใน 24 ชั่วโมง</li>
                <li>• สามารถยกเลิกหรือเปลี่ยนแปลงการจองได้ล่วงหน้า 24 ชั่วโมง</li>
                <li>• กรุณามาถึงก่อนเวลานัดหมาย 15 นาที</li>
                <li>• หากมีคำถามติดต่อ 02-123-4567</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>
                ยกเลิก
              </Button>
              <Button type="submit" className="flex-1 bg-coral-500 hover:bg-coral-600" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    กำลังจอง...
                  </>
                ) : (
                  "ยืนยันการจอง"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
