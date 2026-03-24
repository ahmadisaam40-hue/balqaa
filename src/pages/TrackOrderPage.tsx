import { useState, useEffect, useRef } from "react";
import { Search, Package } from "lucide-react";
import gsap from "gsap";

const statuses = [
  { key: "pending", label: "قيد الانتظار", icon: "⏳" },
  { key: "processing", label: "قيد التجهيز", icon: "📦" },
  { key: "shipping", label: "في الطريق", icon: "🚚" },
  { key: "delivered", label: "تم التوصيل", icon: "✅" },
  { key: "cancelled", label: "تم الإلغاء", icon: "❌" },
];

const TrackOrderPage = () => {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  // Mock order for demo
  const mockStatus = 1; // processing

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearched(true);
  };

  useEffect(() => {
    if (searched && progressRef.current) {
      const pct = ((mockStatus + 1) / statuses.length) * 100;
      gsap.fromTo(
        progressRef.current,
        { width: "0%" },
        { width: `${pct}%`, duration: 1.2, ease: "power3.out" }
      );
    }
  }, [searched]);

  return (
    <div className="container py-10 max-w-xl">
      <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
        <Package className="w-8 h-8 text-primary" />
        تتبع الطلب
      </h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-10">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="رقم الطلب أو رقم الهاتف"
          className="flex-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none"
        />
        <button type="submit" className="px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-bold">
          <Search className="w-5 h-5" />
        </button>
      </form>

      {searched && (
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <h2 className="font-bold text-lg mb-6">حالة الطلب</h2>

          {/* Progress bar */}
          <div className="relative h-2 bg-secondary rounded-full mb-8 overflow-hidden">
            <div ref={progressRef} className="absolute inset-y-0 right-0 gradient-primary rounded-full" style={{ width: "0%" }} />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-4 gap-2">
            {statuses.map((s, i) => (
              <div key={s.key} className={`text-center ${i <= mockStatus ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`text-2xl mb-2 ${i <= mockStatus ? "" : "opacity-40"}`}>{s.icon}</div>
                <p className={`text-xs font-medium ${i <= mockStatus ? "font-bold" : ""}`}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;
