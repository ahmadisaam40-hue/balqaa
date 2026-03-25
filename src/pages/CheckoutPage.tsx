import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useStore } from "@/contexts/StoreContext";
import { formatPrice, calculateFinalPrice } from "@/lib/formatPrice";
import { MapPin, Phone, User, Truck, Store } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { items, totalPrice, totalSavings, clearCart } = useCart();
  const { addOrder } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [delivery, setDelivery] = useState<"delivery" | "pickup">("delivery");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) { toast.error("يرجى ملء جميع الحقول"); return; }
    if (items.length === 0) { toast.error("السلة فارغة"); return; }

    setLoading(true);

    const orderId = "ORD-" + Date.now().toString(36).toUpperCase();

    let location: { lat: number; lng: number } | undefined;
    if (delivery === "delivery" && navigator.geolocation) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
        });
        location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      } catch { /* optional */ }
    }

    try {
      await addOrder({
        id: orderId,
        name: name.trim(),
        phone: phone.trim(),
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          price: calculateFinalPrice(i.product.price, i.product.hasDiscount, i.product.discountType, i.product.discountValue),
        })),
        total: totalPrice,
        status: "قيد الانتظار",
        deliveryMethod: delivery,
        location,
        createdAt: new Date().toISOString(),
      });

      toast.success(`تم إرسال طلبك بنجاح! رقم الطلب: ${orderId}`);
      clearCart();
      navigate("/track-order");
    } catch (error) {
      console.error("Checkout order creation failed", error);
      toast.error("فشل إرسال الطلب، تحقق من الاتصال بقاعدة البيانات");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <p className="text-xl text-muted-foreground">السلة فارغة</p>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-3xl font-black mb-8">إتمام الطلب</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="font-bold text-lg mb-2">معلومات التواصل</h2>
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1.5">
              <User className="w-4 h-4" /> الاسم الكامل
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none" placeholder="أدخل اسمك" required />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1.5">
              <Phone className="w-4 h-4" /> رقم الهاتف
            </label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none" placeholder="07xxxxxxxxx" required dir="ltr" />
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card">
          <h2 className="font-bold text-lg mb-4">طريقة الاستلام</h2>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setDelivery("delivery")} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${delivery === "delivery" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
              <Truck className={`w-6 h-6 ${delivery === "delivery" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-sm font-bold">توصيل</span>
            </button>
            <button type="button" onClick={() => setDelivery("pickup")} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${delivery === "pickup" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
              <Store className={`w-6 h-6 ${delivery === "pickup" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-sm font-bold">استلام من المتجر</span>
            </button>
          </div>
          {delivery === "delivery" && (
            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> سيتم تحديد موقعك تلقائياً عند تأكيد الطلب
            </p>
          )}
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card space-y-3">
          <h2 className="font-bold text-lg mb-2">ملخص الطلب</h2>
          {items.map((item) => {
            const fp = calculateFinalPrice(item.product.price, item.product.hasDiscount, item.product.discountType, item.product.discountValue);
            return (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span>{item.product.name} × {item.quantity}</span>
                <span className="font-bold">{formatPrice(fp * item.quantity)}</span>
              </div>
            );
          })}
          <div className="border-t border-border pt-3 mt-3">
            {totalSavings > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-medium mb-2">
                <span>التوفير</span>
                <span>{formatPrice(totalSavings)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-black">
              <span>المجموع</span>
              <span className="text-primary">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-4 rounded-xl gradient-primary text-primary-foreground font-bold text-lg hover:shadow-glow transition-all disabled:opacity-50">
          {loading ? "جاري إرسال الطلب..." : "تأكيد الطلب"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
