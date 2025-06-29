import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface RegisterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  apiBaseUrl?: string
}

export default function RegisterDialog({ open, onOpenChange, apiBaseUrl }: RegisterDialogProps) {
  const API_BASE_URL = apiBaseUrl || process.env.NEXT_PUBLIC_BACKEND_URL
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  })
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerError, setRegisterError] = useState("")
  const [registerSuccess, setRegisterSuccess] = useState("")

  const handleRegister = async () => {
    setRegisterLoading(true)
    setRegisterError("")
    setRegisterSuccess("")
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      })
      const data = await res.json()
      if (!res.ok) {
        // แสดง error ราย field ถ้ามี
        if (data.errors && Array.isArray(data.errors)) {
          setRegisterError(data.errors.map((e: any) => `${e.field}: ${e.message}`).join("\n"))
        } else if (typeof data.error === "string") {
          setRegisterError(data.error)
        } else if (typeof data.error === "object" && data.error.message) {
          setRegisterError(data.error.message)
        } else {
          setRegisterError("สมัครสมาชิกไม่สำเร็จ")
        }
        return
      }
      setRegisterSuccess("สมัครสมาชิกสำเร็จแล้ว!")
      setTimeout(() => {
        onOpenChange(false)
        setRegisterForm({ username: "", email: "", password: "", firstName: "", lastName: "" })
        setRegisterSuccess("")
      }, 1200)
    } catch (err: any) {
      setRegisterError(err?.message || JSON.stringify(err) || "เกิดข้อผิดพลาด")
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>สมัครสมาชิกใหม่ (Register)</DialogTitle>
          <DialogDescription>
            กรอกข้อมูลเพื่อสมัครสมาชิกใหม่สำหรับระบบแอดมิน
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Username" value={registerForm.username} onChange={e => setRegisterForm(f => ({ ...f, username: e.target.value }))} />
          <Input placeholder="Email" type="email" value={registerForm.email} onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))} />
          <Input placeholder="ชื่อจริง (First Name)" value={registerForm.firstName} onChange={e => setRegisterForm(f => ({ ...f, firstName: e.target.value }))} />
          <Input placeholder="นามสกุล (Last Name)" value={registerForm.lastName} onChange={e => setRegisterForm(f => ({ ...f, lastName: e.target.value }))} />
          <Input placeholder="Password" type="password" value={registerForm.password} onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))} />
          {registerError && <div className="text-red-500 text-sm whitespace-pre-line">{registerError}</div>}
          {registerSuccess && <div className="text-green-600 text-sm">{registerSuccess}</div>}
        </div>
        <DialogFooter>
          <Button onClick={handleRegister} className="bg-coral-500 hover:bg-coral-600 text-white" disabled={registerLoading}>
            {registerLoading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
