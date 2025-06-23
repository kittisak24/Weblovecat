import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import React from "react";

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editProduct: any;
  setEditProduct: (product: any) => void;
  productCategories: string[];
}

const EditProductDialog: React.FC<EditProductDialogProps> = ({
  open,
  onOpenChange,
  editProduct,
  setEditProduct,
  productCategories,
}) => {
  // ฟังก์ชันอัปเดตสินค้า (ย้ายมาจาก admin-dashboard)
  const handleUpdateProduct = async (id: string, updatedProduct: any, onSuccess?: () => void) => {
    if (!id || !updatedProduct) return;
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    // whitelist เฉพาะ field ที่ backend อนุญาต
    const allowedFields = [
      "name", "price", "stock", "inStock", "isActive", "category", "image", "badge", "rating", "reviews"
    ];
    const updateData: any = {};
    allowedFields.forEach(field => {
      if (updatedProduct[field] !== undefined) updateData[field] = updatedProduct[field];
    });
    // รองรับทั้ง stock และ inStock
    if (updateData.inStock !== undefined) {
      updateData.stock = updateData.inStock;
      delete updateData.inStock;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) throw new Error("อัปเดตสินค้าไม่สำเร็จ");
      // const updated = await res.json();
      if (onSuccess) onSuccess();
      alert("อัปเดตสินค้าสำเร็จ");
    } catch (err) {
      alert(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={editProduct ? "edit-product-description" : undefined}>
        <DialogHeader>
          <DialogTitle>แก้ไขสินค้า</DialogTitle>
          {editProduct && (
            <DialogDescription id="edit-product-description">
              แก้ไขข้อมูลสินค้าและบันทึกการเปลี่ยนแปลง
            </DialogDescription>
          )}
        </DialogHeader>
        {editProduct && (
          <div className="space-y-4">
            <Input placeholder="ชื่อสินค้า" value={editProduct.name || ""} onChange={e => setEditProduct({ ...editProduct, name: e.target.value })} />
            <Select value={editProduct.category || ""} onValueChange={v => setEditProduct({ ...editProduct, category: v })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="เลือกหมวดหมู่สินค้า" />
              </SelectTrigger>
              <SelectContent>
                {productCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">ราคา</label>
                <Input type="number" min={0} placeholder="ราคา" value={editProduct.price === undefined || editProduct.price === null || isNaN(editProduct.price) ? "" : String(editProduct.price)} onChange={e => {
                  const val = e.target.value;
                  setEditProduct({ ...editProduct, price: val === "" ? "" : isNaN(Number(val)) ? "" : Number(val) });
                }} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนสินค้าในคลัง</label>
                <Input type="number" min={0} placeholder="จำนวนสินค้าในคลัง" value={editProduct.inStock === undefined || editProduct.inStock === null || isNaN(editProduct.inStock) ? "" : String(editProduct.inStock)} onChange={e => {
                  const val = e.target.value;
                  setEditProduct({ ...editProduct, inStock: val === "" ? "" : isNaN(Number(val)) ? "" : Number(val) });
                }} />
              </div>
            </div>
            <Input placeholder="URL รูปภาพ" value={editProduct.image || ""} onChange={e => setEditProduct({ ...editProduct, image: e.target.value })} />
            <div className="flex items-center gap-2">
              <Switch checked={editProduct.isActive === true } onCheckedChange={v => setEditProduct({ ...editProduct, isActive: v ? true : false })} />
              <span>{editProduct.isActive? "เปิดการขาย" : "ปิดการขาย"}</span>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button onClick={() => {
          }} className="bg-coral-500 hover:bg-coral-600 text-white">บันทึก</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
