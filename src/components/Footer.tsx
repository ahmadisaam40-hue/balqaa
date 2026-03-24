import { MapPin, MessageSquare } from "lucide-react";

// WAZE_LAT و WAZE_LNG: غيّر هذه القيم لإحداثيات الصيدلية الفعلية
const WAZE_LAT = 33.35509696632626;
const WAZE_LNG = 44.354746121522815;
const WAZE_URL = `https://waze.com/ul?ll=${WAZE_LAT},${WAZE_LNG}&navigate=yes`;

const Footer = () => (
  <footer className="border-t border-border bg-card/50 mt-20">
    <div className="container py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-black text-primary mb-3">صيدلية البلقاء</h3>
          <p className="text-sm text-muted-foreground">وجهتك الأولى لمستحضرات التجميل والعناية بالبشرة في العراق</p>
        </div>
        <div>
          <h4 className="font-bold mb-3">روابط سريعة</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/shop" className="hover:text-primary transition-colors">المتجر</a></li>
            <li><a href="/track-order" className="hover:text-primary transition-colors">تتبع الطلب</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">تواصل معنا</h4>
          <div className="space-y-3">
            <a
              href="https://wa.me/9647847501000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              واتساب
            </a>
            <a
              href={WAZE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <MapPin className="w-4 h-4" />
              موقعنا على Waze
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} صيدلية البلقاء. جميع الحقوق محفوظة
      </div>
    </div>
  </footer>
);

export default Footer;
