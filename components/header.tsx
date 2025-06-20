"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import BookingModal from "@/components/booking-modal"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  const navigation = [
    { name: "หน้าแรก", href: "/" },
    { name: "บริการ", href: "/services" },
    { name: "สินค้า", href: "/products" },
    { name: "บทความ", href: "/blog" },
    { name: "ติดต่อเรา", href: "/contact" },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-coral-500 mr-2" />
            <span className="text-xl font-bold text-gray-900">We Love Pet</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-coral-500 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <Button className="bg-coral-500 hover:bg-coral-600 text-white" onClick={() => setIsBookingModalOpen(true)}>
              จองบริการ
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-coral-500">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-coral-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                <Button
                  className="w-full bg-coral-500 hover:bg-coral-600 text-white"
                  onClick={() => {
                    setIsBookingModalOpen(true)
                    setIsMenuOpen(false)
                  }}
                >
                  จองบริการ
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </header>
  )
}
