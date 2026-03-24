import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { StoreProvider } from "@/contexts/StoreContext";
import IntroOverlay from "@/components/IntroOverlay";
import Navbar from "@/components/Navbar";
import CartPanel from "@/components/CartPanel";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import CheckoutPage from "@/pages/CheckoutPage";
import TrackOrderPage from "@/pages/TrackOrderPage";
import AdminGuard from "@/pages/admin/AdminGuard";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProductsPage from "@/pages/admin/AdminProductsPage";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import AdminBoxesPage from "@/pages/admin/AdminBoxesPage";
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();
const adminEnabled = import.meta.env.VITE_ENABLE_ADMIN === "true";

const App = () => {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <StoreProvider>
          <CartProvider>
            <Sonner position="top-center" dir="rtl" />
            <BrowserRouter>
              <Routes>
                {/* Admin Routes */}
                {adminEnabled && (
                  <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProductsPage />} />
                    <Route path="orders" element={<AdminOrdersPage />} />
                    <Route path="boxes" element={<AdminBoxesPage />} />
                    <Route path="categories" element={<AdminCategoriesPage />} />
                  </Route>
                )}

                {/* Store Routes */}
                <Route
                  path="*"
                  element={
                    <>
                      {!introComplete && <IntroOverlay onComplete={() => setIntroComplete(true)} />}
                      <div className={introComplete ? "animate-in fade-in duration-500" : "opacity-0"}>
                        <Navbar />
                        <CartPanel />
                        <main className="min-h-screen">
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/shop" element={<ShopPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/track-order" element={<TrackOrderPage />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                        <Footer />
                      </div>
                    </>
                  }
                />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </StoreProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
