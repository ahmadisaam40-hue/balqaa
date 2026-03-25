import { useStore, Order } from "@/contexts/StoreContext";
import { formatPrice } from "@/lib/formatPrice";
import { Package, MapPin, Phone, User } from "lucide-react";
import { toast } from "sonner";

const statusOptions: Order["status"][] = ["قيد الانتظار", "قيد التجهيز", "في الطريق", "تم التوصيل", "تم الإلغاء"];

const statusColors: Record<string, string> = {
  "قيد الانتظار": "bg-amber-100 text-amber-800",
  "قيد التجهيز": "bg-blue-100 text-blue-800",
  "في الطريق": "bg-purple-100 text-purple-800",
  "تم التوصيل": "bg-green-100 text-green-800",
  "تم الإلغاء": "bg-red-100 text-red-800",
};

const AdminOrdersPage = () => {
  const { orders, updateOrderStatus } = useStore();

  const handleStatusChange = async (id: string, status: Order["status"]) => {
    try {
      await updateOrderStatus(id, status);
      toast.success("تم تحديث حالة الطلب");
    } catch (error) {
      console.error("Order status update failed", error);
      toast.error("فشل تحديث حالة الطلب في Firebase");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-black mb-6">إدارة الطلبات</h2>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">لا توجد طلبات بعد</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-card rounded-2xl p-5 shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs text-muted-foreground">#{order.id}</span>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1 text-sm"><User className="w-3.5 h-3.5" /> {order.name}</span>
                    <span className="flex items-center gap-1 text-sm"><Phone className="w-3.5 h-3.5" /> {order.phone}</span>
                  </div>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border-0 outline-none cursor-pointer ${statusColors[order.status] || "bg-secondary"}`}
                >
                  {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-1 mb-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.productName} × {item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{order.deliveryMethod === "delivery" ? "🚚 توصيل" : "🏪 استلام"}</span>
                  {order.location && (
                    <a href={`https://maps.google.com/?q=${order.location.lat},${order.location.lng}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                      <MapPin className="w-3 h-3" /> الموقع
                    </a>
                  )}
                  <span>{new Date(order.createdAt).toLocaleDateString("ar-IQ")}</span>
                </div>
                <span className="font-black text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
