import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/contexts/StoreContext";

gsap.registerPlugin(ScrollTrigger);

const ShopPage = () => {
  const { products, categories: storeCats } = useStore();
  const categories = ["الكل", ...storeCats.map((c) => c.name)];
  const [activeCategory, setActiveCategory] = useState<string>("الكل");
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = activeCategory === "الكل" ? products : products.filter((p) => p.category === activeCategory);

  useEffect(() => {
    if (!gridRef.current) return;
    gsap.fromTo(
      gridRef.current.querySelectorAll(".product-card"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
    );
  }, [activeCategory]);

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-black mb-8">المتجر</h1>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              activeCategory === cat
                ? "gradient-primary text-primary-foreground shadow-lg"
                : "bg-secondary text-secondary-foreground hover:bg-primary/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filtered.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-20">لا توجد منتجات في هذه الفئة</p>
      )}
    </div>
  );
};

export default ShopPage;
