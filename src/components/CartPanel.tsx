import { useEffect, useRef } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import gsap from "gsap";
import { useCart } from "@/contexts/CartContext";
import { resolveProductImage } from "@/data/images";
import { formatPrice, calculateFinalPrice } from "@/lib/formatPrice";
import { useNavigate } from "react-router-dom";

const CartPanel = () => {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, totalPrice, totalSavings, totalItems } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, pointerEvents: "auto" });
      gsap.fromTo(panelRef.current, { x: "-100%" }, { x: "0%", duration: 0.4, ease: "power3.out" });
    } else {
      gsap.to(panelRef.current, { x: "-100%", duration: 0.3, ease: "power3.in" });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, pointerEvents: "none" });
    }
  }, [isOpen]);

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <>
      <div ref={overlayRef} onClick={closeCart} className="fixed inset-0 z-[60] bg-foreground/30 backdrop-blur-sm opacity-0 pointer-events-none" />
      <div ref={panelRef} className="fixed top-0 right-auto left-0 z-[70] h-full w-full max-w-md bg-card shadow-2xl flex flex-col" style={{ transform: "translateX(-100%)" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">السلة ({totalItems})</h2>
          </div>
          <button onClick={closeCart} className="p-2 rounded-xl hover:bg-secondary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg font-medium">السلة فارغة</p>
              <p className="text-sm">أضف منتجات لتبدأ التسوق</p>
            </div>
          ) : (
            items.map((item) => {
              const fp = calculateFinalPrice(item.product.price, item.product.hasDiscount, item.product.discountType, item.product.discountValue);
              return (
                <div key={item.product.id} className="flex gap-3 bg-secondary/50 rounded-xl p-3">
                  <img
                    src={resolveProductImage(item.product)}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate">{item.product.name}</h4>
                    <p className="text-sm font-black text-primary mt-1">{formatPrice(fp)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1 rounded-lg bg-card hover:bg-primary/10 transition-colors">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1 rounded-lg bg-card hover:bg-primary/10 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => removeFromCart(item.product.id)} className="mr-auto p-1 rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-border space-y-3">
            {totalSavings > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-medium bg-green-50 rounded-lg px-3 py-2">
                <span>وفرت</span>
                <span>{formatPrice(totalSavings)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-black">
              <span>المجموع</span>
              <span className="text-primary">{formatPrice(totalPrice)}</span>
            </div>
            <button onClick={handleCheckout} className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-bold text-sm hover:shadow-lg transition-shadow">
              إتمام الشراء
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPanel;
