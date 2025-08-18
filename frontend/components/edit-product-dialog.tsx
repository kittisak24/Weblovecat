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
  // ฟังก์ชันอัปเดตสินค้า
  const handleUpdateProduct = async (id: string, updatedProduct: any, onSuccess?: () => void) => {
    if (!id || !updatedProduct) return;
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

    // สร้างข้อมูลที่ต้องการอัปเดต โดยรวมทุกฟิลด์ที่แก้ไข
    const updateData = {
      name: updatedProduct.name,
      category: updatedProduct.category,
      price: updatedProduct.price,
      image: updatedProduct.image,
      inStock: updatedProduct.inStock, // ส่ง inStock โดยตรงเป็น Boolean
    };

    console.log("Updated Product Data:", updateData);

    const token = localStorage.getItem("admin_token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = ` Prisoner ${token}`;

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "อัปเดตสินค้าไม่สำเร็จ");
      }

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
            <Input
              placeholder="ชื่อสินค้า"
              value={editProduct.name || ""}
              onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
            />
            <Select
              value={editProduct.category || ""}
              onValueChange={(v) => setEditProduct({ ...editProduct, category: v })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="เลือกหมวดหมู่สินค้า" />
              </SelectTrigger>
              <SelectContent>
                {productCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">ราคา</label>
                <Input
                  type="number"
                  min={0}
                  placeholder="ราคา"
                  value={
                    editProduct.price === undefined ||
                    editProduct.price === null ||
                    isNaN(editProduct.price)
                      ? ""
                      : String(editProduct.price)
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditProduct({
                      ...editProduct,
                      price: val === "" ? "" : isNaN(Number(val)) ? "" : Number(val),
                    });
                  }}
                />
              </div>
            </div>
            <Input
              placeholder="URL รูปภาพ"
              value={editProduct.image || ""}
              onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
            />
            <div className="flex items-center gap-2 mt-2">
              <label className="text-sm font-medium text-gray-700">สถานะสินค้า</label>
              <Switch
                checked={editProduct.inStock ?? false}
                onCheckedChange={(checked) =>
                  setEditProduct({ ...editProduct, inStock: checked })
                }
                id="inStock-switch"
              />
              <span className="text-xs text-gray-500">
                {editProduct.inStock ? "เปิดการขาย" : "ปิดการขาย"}
              </span>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button
            onClick={() => {
              if (editProduct && editProduct._id) {
                handleUpdateProduct(editProduct._id, editProduct, () => onOpenChange(false));
              }
            }}
            className="bg-coral-500 hover:bg-coral-600 text-white"
            disabled={!editProduct || !editProduct._id}
          >
            บันทึก
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;