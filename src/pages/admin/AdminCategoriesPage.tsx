import { useState } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Plus, Pencil, Trash2, X, Tag } from "lucide-react";
import { toast } from "sonner";

const AdminCategoriesPage = () => {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");

  const openAdd = () => {
    setName("");
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (cat: { id: string; name: string }) => {
    setName(cat.name);
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("يرجى إدخال اسم الفئة");
      return;
    }

    if (editingId) {
      updateCategory(editingId, name.trim());
      toast.success("تم تعديل الفئة بنجاح");
    } else {
      addCategory(name.trim());
      toast.success("تمت إضافة الفئة بنجاح");
    }
    setShowForm(false);
  };

  const handleDelete = (id: string, catName: string) => {
    const usedCount = products.filter((p) => p.category === catName).length;
    if (usedCount > 0) {
      toast.error(`لا يمكن حذف الفئة، هناك ${usedCount} منتج مرتبط بها`);
      return;
    }
    deleteCategory(id);
    toast.success("تم حذف الفئة");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black">إدارة الفئات</h2>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground font-bold text-sm">
          <Plus className="w-4 h-4" /> إضافة فئة
        </button>
      </div>

      <div className="grid gap-3">
        {categories.map((cat) => {
          const count = products.filter((p) => p.category === cat.name).length;
          return (
            <div key={cat.id} className="flex items-center gap-4 bg-card rounded-xl p-4 shadow-card">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Tag className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm">{cat.name}</h3>
                <span className="text-xs text-muted-foreground">{count} منتج</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(cat)} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cat.id, cat.name)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        {categories.length === 0 && (
          <p className="text-center py-16 text-muted-foreground">لا توجد فئات. أضف فئتك الأولى!</p>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4" onClick={() => setShowForm(false)}>
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black">{editingId ? "تعديل الفئة" : "إضافة فئة جديدة"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-secondary"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">اسم الفئة</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: مكياج" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-ring outline-none" required />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-bold">
                {editingId ? "حفظ التعديلات" : "إضافة الفئة"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
