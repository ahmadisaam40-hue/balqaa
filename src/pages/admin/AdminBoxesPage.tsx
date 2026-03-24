import { useState } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Box } from "@/data/products";
import { boxImages } from "@/data/images";
import { formatPrice, calculateFinalPrice } from "@/lib/formatPrice";
import { Plus, Pencil, Trash2, X, Upload, ImageIcon, Check } from "lucide-react";
import { toast } from "sonner";

const emptyBox: Omit<Box, "id"> = {
  name: "", items: [], price: 0, image: "",
  hasDiscount: false, discountType: "percentage", discountValue: 0,
};

const AdminBoxesPage = () => {
  const { boxes, addBox, updateBox, deleteBox, products } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyBox);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const openAdd = () => {
    setForm(emptyBox);
    setEditingId(null);
    setSelectedProductIds([]);
    setImagePreview(null);
    setShowForm(true);
  };

  const openEdit = (b: Box) => {
    setForm({ ...b });
    setEditingId(b.id);
    // Match items by name to product ids
    const ids = products.filter((p) => b.items.includes(p.name)).map((p) => p.id);
    setSelectedProductIds(ids);
    setImagePreview(boxImages[b.id] || b.image || null);
    setShowForm(true);
  };

  const toggleProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("يرجى اختيار ملف صورة فقط"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setForm((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("يرجى إدخال اسم البوكس"); return; }
    if (selectedProductIds.length === 0) { toast.error("يرجى اختيار منتج واحد على الأقل"); return; }
    if (form.price <= 0) { toast.error("يرجى إدخال سعر صحيح"); return; }

    const itemNames = products.filter((p) => selectedProductIds.includes(p.id)).map((p) => p.name);
    const box = { ...form, items: itemNames };

    if (editingId) {
      updateBox({ ...box, id: editingId });
      toast.success("تم تعديل البوكس بنجاح");
    } else {
      addBox({ ...box, id: "b" + Date.now().toString() });
      toast.success("تمت إضافة البوكس بنجاح");
    }
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black">إدارة البوكسات</h2>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground font-bold text-sm">
          <Plus className="w-4 h-4" /> إضافة بوكس
        </button>
      </div>

      <div className="grid gap-3">
        {boxes.map((b) => {
          const fp = calculateFinalPrice(b.price, b.hasDiscount, b.discountType, b.discountValue);
          const img = boxImages[b.id] || b.image;
          return (
            <div key={b.id} className="flex items-center gap-4 bg-card rounded-xl p-4 shadow-card">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-pink-light flex-shrink-0">
                {img ? <img src={img} alt={b.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-muted-foreground" /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate">{b.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{b.items.join(" • ")}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-black text-primary">{formatPrice(fp)}</span>
                  {b.hasDiscount && <span className="text-xs text-muted-foreground line-through">{formatPrice(b.price)}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(b)} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => { deleteBox(b.id); toast.success("تم حذف البوكس"); }} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
        {boxes.length === 0 && <p className="text-center py-16 text-muted-foreground">لا توجد بوكسات. أضف بوكسك الأول!</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4" onClick={() => setShowForm(false)}>
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black">{editingId ? "تعديل البوكس" : "إضافة بوكس جديد"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-secondary"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">صورة البوكس</label>
                <div className="border-2 border-dashed border-border rounded-xl p-4 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="preview" className="w-32 h-32 rounded-lg object-cover mx-auto" />
                      <button type="button" onClick={() => { setImagePreview(null); setForm((f) => ({ ...f, image: "" })); }} className="absolute top-0 right-1/2 translate-x-16 -translate-y-2 p-1 rounded-full bg-destructive text-destructive-foreground"><X className="w-3 h-3" /></button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="w-8 h-8" /><span className="text-sm">اضغط لرفع صورة</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">اسم البوكس</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-ring outline-none" required />
              </div>

              {/* Select Products */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  اختر المنتجات ({selectedProductIds.length} منتج محدد)
                </label>
                <div className="border border-input rounded-xl max-h-48 overflow-y-auto">
                  {products.length === 0 ? (
                    <p className="text-center py-4 text-sm text-muted-foreground">لا توجد منتجات. أضف منتجات أولاً.</p>
                  ) : (
                    products.map((p) => {
                      const selected = selectedProductIds.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => toggleProduct(p.id)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-right transition-colors ${
                            selected ? "bg-primary/10" : "hover:bg-secondary/50"
                          } border-b border-border last:border-b-0`}
                        >
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            selected ? "bg-primary border-primary" : "border-input"
                          }`}>
                            {selected && <Check className="w-3 h-3 text-primary-foreground" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium truncate block">{p.name}</span>
                            <span className="text-xs text-muted-foreground">{p.category} • {formatPrice(p.price)}</span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">السعر (د.ع)</label>
                <input type="number" value={form.price || ""} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-ring outline-none" dir="ltr" required />
              </div>

              {/* Discount */}
              <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.hasDiscount} onChange={(e) => setForm((f) => ({ ...f, hasDiscount: e.target.checked }))} className="w-4 h-4 accent-primary" />
                  <span className="text-sm font-bold">تفعيل الخصم</span>
                </label>
                {form.hasDiscount && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">نوع الخصم</label>
                      <select value={form.discountType} onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value as "percentage" | "fixed" }))} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none">
                        <option value="percentage">نسبة %</option>
                        <option value="fixed">مبلغ ثابت</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">القيمة</label>
                      <input type="number" value={form.discountValue || ""} onChange={(e) => setForm((f) => ({ ...f, discountValue: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none" dir="ltr" />
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-bold">
                {editingId ? "حفظ التعديلات" : "إضافة البوكس"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBoxesPage;
