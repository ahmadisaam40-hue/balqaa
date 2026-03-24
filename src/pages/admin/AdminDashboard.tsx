import { useStore } from "@/contexts/StoreContext";
import { Package, ShoppingCart, Gift, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

const AdminDashboard = () => {
  const { products, orders, boxes } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "قيد الانتظار").length;

  const stats = [
    { label: "المنتجات", value: products.length, icon: Package, color: "text-primary" },
    { label: "الطلبات", value: orders.length, icon: ShoppingCart, color: "text-accent" },
    { label: "البوكسات", value: boxes.length, icon: Gift, color: "text-pink-glow" },
    { label: "الإيرادات", value: formatPrice(totalRevenue), icon: TrendingUp, color: "text-green-600" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-black mb-6">نظرة عامة</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {pendingOrders > 0 && (
        <div className="bg-accent/20 border border-accent rounded-2xl p-5">
          <p className="font-bold">⏳ لديك {pendingOrders} طلب بانتظار المعالجة</p>
        </div>
      )}

      {orders.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">لا توجد طلبات بعد</p>
          <p className="text-sm">ستظهر الطلبات هنا عند استلامها</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
