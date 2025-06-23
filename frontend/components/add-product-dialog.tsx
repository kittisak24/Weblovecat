import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import React from "react";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newProduct: any;
  setNewProduct: (product: any) => void;
  handleAddProduct: () => void;
  addProductError: string;
  productCategories: string[];
}

const AddProductDialog: React.FC<AddProductDialogProps> = ({
  open,
  onOpenChange,
  newProduct,
  setNewProduct,
  handleAddProduct,
  addProductError,
  productCategories,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="add-product-description">
        <DialogHeader>
          <DialogTitle>เพิ่มสินค้าใหม่</DialogTitle>
          <DialogDescription id="add-product-description" className="sr-only">
            กรอกข้อมูลสินค้าให้ครบถ้วนเพื่อเพิ่มสินค้าใหม่ลงระบบ
          </DialogDescription>
        </DialogHeader>
        {addProductError && <div className="text-red-500 text-sm">{addProductError}</div>}
        <div className="space-y-4">
          <Input placeholder="ชื่อสินค้า" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
          <Select value={newProduct.category} onValueChange={v => setNewProduct({ ...newProduct, category: v })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="เลือกหมวดหมู่สินค้า" />
            </SelectTrigger>
            <SelectContent>
              {productCategories.map((cat, idx) => (
                <SelectItem key={`${cat}-${idx}`} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">ราคา</label>
              <Input type="number" min={0} placeholder="ราคา" value={Number.isNaN(newProduct.price) ? "" : newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนสินค้าในคลัง</label>
              <Input type="number" min={0} placeholder="จำนวนสินค้าในคลัง" value={Number.isNaN(newProduct.inStock) ? "" : newProduct.inStock} onChange={e => setNewProduct({ ...newProduct, inStock: Number(e.target.value) })} />
            </div>
          </div>
          <Input placeholder="URL รูปภาพ" value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} />
          <div className="flex items-center gap-2">
            <Switch checked={newProduct.isActive === true} onCheckedChange={v => setNewProduct({ ...newProduct, isActive: v ? true : false })} />
            <span>{newProduct.isActive ? "เปิดการขาย" : "ปิดการขาย"}</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddProduct} className="bg-coral-500 hover:bg-coral-600 text-white">บันทึก</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
