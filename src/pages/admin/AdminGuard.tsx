import { useState } from "react";
import AdminLoginPage from "./AdminLoginPage";

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem("balqa_admin") === "1");

  if (!authenticated) {
    return <AdminLoginPage onLogin={() => setAuthenticated(true)} />;
  }

  return <>{children}</>;
};

export default AdminGuard;
