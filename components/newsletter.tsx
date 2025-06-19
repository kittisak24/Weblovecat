"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Gift } from "lucide-react"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
    setEmail("")
  }

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-r from-coral-500 to-teal-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex p-4 bg-white/20 rounded-full mb-8">
            <Mail className="h-8 w-8 text-white" />
          </div>

          {/* Content */}
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">รับข่าวสารและเคล็ดลับดีๆ</h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            สมัครรับจดหมายข่าวเพื่อรับเคล็ดลับการดูแลสัตว์เลี้ยง ข่าวสารใหม่ๆ และโปรโมชั่นพิเศษ
          </p>

          {/* Incentive */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Gift className="h-5 w-5 text-yellow-300" />
            <span className="text-white font-medium">รับส่วนลด 10% สำหรับสมาชิกใหม่!</span>
          </div>

          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="กรอกอีเมลของคุณ"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
              />
              <Button
                type="submit"
                className="bg-white text-coral-500 hover:bg-gray-100 font-medium px-8"
                disabled={isSubmitted}
              >
                {isSubmitted ? "สำเร็จ!" : "สมัคร"}
              </Button>
            </div>
          </form>

          {/* Success Message */}
          {isSubmitted && (
            <div className="mt-4 text-white font-medium">✨ ขอบคุณที่สมัครสมาชิก! เราจะส่งข่าวสารดีๆ ให้คุณเร็วๆ นี้</div>
          )}

          {/* Privacy Note */}
          <p className="text-sm text-white/70 mt-4">เราเคารพความเป็นส่วนตัวของคุณ และจะไม่แชร์ข้อมูลให้กับบุคคลที่สาม</p>
        </div>
      </div>
    </section>
  )
}
