import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD;

const AdminLoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ADMIN_PASS) {
      toast.error("لم يتم إعداد كلمة مرور لوحة التحكم");
      return;
    }

    if (password === ADMIN_PASS) {
      sessionStorage.setItem("balqa_admin", "1");
      onLogin();
      toast.success("تم تسجيل الدخول بنجاح");
    } else {
      toast.error("كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-card p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-4">
            <Lock className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-black">لوحة التحكم</h1>
          <p className="text-sm text-muted-foreground mt-1">صيدلية البلقاء</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none pl-10"
              required
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button type="submit" className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-bold">
            دخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
