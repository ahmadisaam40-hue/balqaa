import { useEffect, useRef, useState } from "react";
import { Heart, ImageIcon, ShoppingBag } from "lucide-react";
import gsap from "gsap";
import { Product } from "@/data/products";
import { resolveProductImage } from "@/data/images";
import { formatPrice, calculateFinalPrice, getDiscountLabel } from "@/lib/formatPrice";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const [imageFailed, setImageFailed] = useState(false);
  const finalPrice = calculateFinalPrice(
    product.price,
    product.hasDiscount,
    product.discountType,
    product.discountValue
  );

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onEnter = () => {
      gsap.to(el, { scale: 1.03, boxShadow: "0 12px 40px -8px hsl(340 30% 50% / 0.2)", duration: 0.3, ease: "power2.out" });
      gsap.to(el.querySelector(".card-btn"), { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(el.querySelector(".card-img"), { scale: 1.08, duration: 0.4, ease: "power2.out" });
    };
    const onLeave = () => {
      gsap.to(el, { scale: 1, boxShadow: "0 4px 20px -4px hsl(340 30% 50% / 0.1)", duration: 0.3, ease: "power2.out" });
      gsap.to(el.querySelector(".card-btn"), { opacity: 0, y: 10, duration: 0.2 });
      gsap.to(el.querySelector(".card-img"), { scale: 1, duration: 0.3 });
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const handleAdd = () => {
    addToCart(product);
    toast.success(`تمت إضافة "${product.name}" إلى السلة`);
  };

  const image = resolveProductImage(product);
  const showImage = Boolean(image) && !imageFailed;

  return (
    <div
      ref={cardRef}
      className="product-card group relative bg-card rounded-2xl overflow-hidden shadow-card cursor-pointer"
    >
      {/* Badge */}
      {(product.badge || product.hasDiscount) && (
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          {product.hasDiscount && product.discountType && product.discountValue && (
            <span className="px-2.5 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
              {getDiscountLabel(product.discountType, product.discountValue)}
            </span>
          )}
          {product.badge && (
            <span className="px-2.5 py-1 rounded-full gradient-primary text-primary-foreground text-xs font-bold">
              {product.badge}
            </span>
          )}
        </div>
      )}

      {/* Wishlist */}
      <button className="absolute top-3 left-3 z-10 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-primary/10 transition-colors">
        <Heart className="w-4 h-4 text-primary" />
      </button>

      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-pink-light">
        {showImage ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            width={640}
            height={640}
            className="card-img w-full h-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageIcon className="h-10 w-10 opacity-50" />
          </div>
        )}
        {/* Add to cart button - appears on hover */}
        <div className="card-btn absolute bottom-4 inset-x-4 opacity-0 translate-y-2.5">
          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full gradient-primary text-primary-foreground text-sm font-bold shadow-lg hover:shadow-xl transition-shadow"
          >
            <ShoppingBag className="w-4 h-4" />
            أضف إلى السلة
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-foreground text-sm mb-2 line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-black text-primary">{formatPrice(finalPrice)}</span>
          {product.hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
