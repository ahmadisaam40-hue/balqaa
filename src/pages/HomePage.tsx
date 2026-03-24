import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, Gift, Sparkles } from "lucide-react";
import heroBg from "@/assets/Screenshot 2026-03-24 181145.png";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/contexts/StoreContext";
import { boxImages } from "@/data/images";
import { formatPrice, calculateFinalPrice, getDiscountLabel } from "@/lib/formatPrice";

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const { products, boxes } = useStore();
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(".hero-title", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
      .fromTo(".hero-sub", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")
      .fromTo(".hero-btn", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" }, "-=0.3");

    sectionRefs.current.forEach((section) => {
      if (!section) return;
      gsap.fromTo(
        section.querySelectorAll(".anim-item"),
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 80%" },
        }
      );
    });

    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  const featured = products.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="صيدلية البلقاء" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/70 to-transparent" />
        </div>
        <div className="container relative z-10 py-20">
          <div className="max-w-lg">
            <h1 className="hero-title text-4xl md:text-6xl font-black text-foreground leading-tight opacity-0">
              جمالك <span className="text-gradient-primary">يبدأ</span> من هنا
            </h1>
            <p className="hero-sub text-muted-foreground text-lg mt-4 opacity-0">
              اكتشفي أفضل مستحضرات التجميل والعناية بالبشرة بأسعار مميزة
            </p>
            <Link
              to="/shop"
              className="hero-btn inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-full gradient-primary text-primary-foreground font-bold text-sm hover:shadow-glow transition-shadow opacity-0"
            >
              تسوقي الآن
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section ref={(el) => (sectionRefs.current[0] = el)} className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="anim-item">
            <h2 className="text-2xl md:text-3xl font-black flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              منتجات مميزة
            </h2>
          </div>
          <Link to="/shop" className="anim-item text-sm font-medium text-primary hover:underline flex items-center gap-1">
            عرض الكل <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((p, i) => (
            <div key={p.id} className="anim-item">
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* Gift Boxes */}
      <section ref={(el) => (sectionRefs.current[1] = el)} className="container py-16">
        <div className="anim-item mb-8">
          <h2 className="text-2xl md:text-3xl font-black flex items-center gap-2">
            <Gift className="w-6 h-6 text-accent" />
            بوكسات الهدايا
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {boxes.map((box) => {
            const fp = calculateFinalPrice(box.price, box.hasDiscount, box.discountType, box.discountValue);
            return (
              <div key={box.id} className="anim-item bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow">
                <div className="relative aspect-[4/3] overflow-hidden bg-pink-light">
                  <img src={boxImages[box.id] || box.image || ""} alt={box.name} className="w-full h-full object-cover" loading="lazy" />
                  {box.hasDiscount && box.discountType && box.discountValue && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
                      {getDiscountLabel(box.discountType, box.discountValue)}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2">{box.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{box.items.join(" • ")}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-primary">{formatPrice(fp)}</span>
                    {box.hasDiscount && (
                      <span className="text-sm text-muted-foreground line-through">{formatPrice(box.price)}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/9647847501000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-green-500 text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all"
        aria-label="واتساب"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
};

export default HomePage;
