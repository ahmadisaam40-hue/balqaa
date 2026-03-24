import { useState } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Product } from "@/data/products";
import { resolveProductImage } from "@/data/images";
import { formatPrice, calculateFinalPrice } from "@/lib/formatPrice";
import { Plus, Pencil, Trash2, X, Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";

const emptyProduct: Omit<Product, "id"> = {
  name: "", price: 0, image: "", category: "مكياج", description: "",
  hasDiscount: false, discountType: "percentage", discountValue: 0, badge: "",
};

const AdminProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useStore();
  const categoryOptions = categories.map((c) => c.name);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const openAdd = () => {
    setForm(emptyProduct);
    setEditingId(null);
    setImagePreview(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setForm({ ...p });
    setEditingId(p.id);
    setImagePreview(resolveProductImage(p) || null);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة فقط");
      return;
    }
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
    if (!form.name.trim()) { toast.error("يرجى إدخال اسم المنتج"); return; }
    if (form.price <= 0) { toast.error("يرجى إدخال سعر صحيح"); return; }

    if (editingId) {
      updateProduct({ ...form, id: editingId });
      toast.success("تم تعديل المنتج بنجاح");
    } else {
      addProduct({ ...form, id: Date.now().toString() });
      toast.success("تمت إضافة المنتج بنجاح");
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast.success("تم حذف المنتج");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black">إدارة المنتجات</h2>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground font-bold text-sm">
          <Plus className="w-4 h-4" /> إضافة منتج
        </button>
      </div>

      {/* Product List */}
      <div className="grid gap-3">
        {products.map((p) => {
          const fp = calculateFinalPrice(p.price, p.hasDiscount, p.discountType, p.discountValue);
          const img = resolveProductImage(p);
          return (
            <div key={p.id} className="flex items-center gap-4 bg-card rounded-xl p-4 shadow-card">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-pink-light flex-shrink-0">
                {img ? <img src={img} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-muted-foreground" /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate">{p.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-black text-primary">{formatPrice(fp)}</span>
                  {p.hasDiscount && <span className="text-xs text-muted-foreground line-through">{formatPrice(p.price)}</span>}
                </div>
                <span className="text-xs text-muted-foreground">{p.category}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        {products.length === 0 && (
          <p className="text-center py-16 text-muted-foreground">لا توجد منتجات. أضف منتجك الأول!</p>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4" onClick={() => setShowForm(false)}>
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black">{editingId ? "تعديل المنتج" : "إضافة منتج جديد"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-secondary"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">صورة المنتج</label>
                <div className="border-2 border-dashed border-border rounded-xl p-4 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="preview" className="w-32 h-32 rounded-lg object-cover mx-auto" />
                      <button type="button" onClick={() => { setImagePreview(null); setForm((f) => ({ ...f, image: "" })); }} className="absolute top-0 right-1/2 translate-x-16 -translate-y-2 p-1 rounded-full bg-destructive text-destructive-foreground">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="w-8 h-8" />
                      <span className="text-sm">اضغط لرفع صورة</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">اسم المنتج</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-ring outline-none" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">السعر (د.ع)</label>
                  <input type="number" value={form.price || ""} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-ring outline-none" dir="ltr" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">الفئة</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Product["category"] }))} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-ring outline-none">
                    {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">الوصف</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-ring outline-none resize-none" />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">الشارة (اختياري)</label>
                <input value={form.badge || ""} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))} placeholder="مثال: جديد، عرض" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-ring outline-none" />
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
                        <option value="percentage">نسبة مئوية %</option>
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
                {editingId ? "حفظ التعديلات" : "إضافة المنتج"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
