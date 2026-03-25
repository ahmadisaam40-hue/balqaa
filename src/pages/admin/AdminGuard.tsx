import { useState } from "react";
import AdminLoginPage from "./AdminLoginPage";

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(() => {
    const isAuth = sessionStorage.getItem("balqa_admin") === "1";
    console.log("[AdminGuard] Initial auth state:", isAuth);
    return isAuth;
  });

  console.log("[AdminGuard] Rendering, authenticated:", authenticated);

  if (!authenticated) {
    return <AdminLoginPage onLogin={() => {
      console.log("[AdminGuard] Login successful");
      setAuthenticated(true);
    }} />;
  }

  return <>{children}</>;
};

export default AdminGuard;
