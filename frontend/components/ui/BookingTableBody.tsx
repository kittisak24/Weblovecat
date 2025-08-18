import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const BookingTableBody = () => {
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/bookings`);
        const data = await response.json();

        if (data.success) {
          setRecentBookings(data.data.bookings); // สมมุติว่า key คือ `bookings`
          console.log("Recent bookings fetched:", data.data.bookings);
        } else {
          console.error("โหลดข้อมูลไม่สำเร็จ:", data.message);
        }
      } catch (err) {
        console.error("เกิดข้อผิดพลาดระหว่างโหลดข้อมูล:", err);
      }
    };

    fetchBookings();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <>
      {recentBookings.map((booking) => (
        <tr key={booking._id} className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {booking.bookingNumber || booking._id}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div>
              <div className="text-sm font-medium text-gray-900">
                {booking.userId?.firstName || "ไม่ระบุ"} {booking.userId?.lastName || ""}
              </div>
              <div className="text-sm text-gray-500">
                {booking.petDetails?.name || "ไม่ระบุสัตว์"}
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {booking.serviceId?.name || "ไม่ระบุบริการ"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {booking.bookingDate} {booking.startTime}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <Badge className={getStatusColor(booking.status)}>
              {booking.status === "confirmed"
                ? "ยืนยันแล้ว"
                : booking.status === "pending"
                ? "รอยืนยัน"
                : booking.status === "completed"
                ? "เสร็จสิ้น"
                : "ไม่ทราบสถานะ"}
            </Badge>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {formatCurrency(booking.amount)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default BookingTableBody;
