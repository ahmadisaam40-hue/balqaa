import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Product, Box, products as defaultProducts, boxes as defaultBoxes, categories as defaultCategoriesConst } from "@/data/products";

export interface Order {
  id: string;
  name: string;
  phone: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  total: number;
  status: "قيد الانتظار" | "قيد التجهيز" | "في الطريق" | "تم التوصيل" | "تم الإلغاء";
  deliveryMethod: "delivery" | "pickup";
  location?: { lat: number; lng: number };
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}

const defaultCategories: Category[] = defaultCategoriesConst
  .filter((c) => c !== "الكل")
  .map((name, i) => ({ id: "cat" + (i + 1), name }));

interface StoreContextType {
  products: Product[];
  boxes: Box[];
  orders: Order[];
  categories: Category[];
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  addBox: (b: Box) => void;
  updateBox: (b: Box) => void;
  deleteBox: (id: string) => void;
  addOrder: (o: Order) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = { products: "balqa_products", boxes: "balqa_boxes", orders: "balqa_orders", categories: "balqa_categories" };

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage(STORAGE_KEYS.products, defaultProducts));
  const [boxes, setBoxes] = useState<Box[]>(() => loadFromStorage(STORAGE_KEYS.boxes, defaultBoxes));
  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage(STORAGE_KEYS.orders, []));
  const [categories, setCategories] = useState<Category[]>(() => loadFromStorage(STORAGE_KEYS.categories, defaultCategories));

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.boxes, JSON.stringify(boxes)); }, [boxes]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories)); }, [categories]);

  const addProduct = useCallback((p: Product) => setProducts((prev) => [...prev, p]), []);
  const updateProduct = useCallback((p: Product) => setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x))), []);
  const deleteProduct = useCallback((id: string) => setProducts((prev) => prev.filter((x) => x.id !== id)), []);

  const addBox = useCallback((b: Box) => setBoxes((prev) => [...prev, b]), []);
  const updateBox = useCallback((b: Box) => setBoxes((prev) => prev.map((x) => (x.id === b.id ? b : x))), []);
  const deleteBox = useCallback((id: string) => setBoxes((prev) => prev.filter((x) => x.id !== id)), []);

  const addOrder = useCallback((o: Order) => setOrders((prev) => [...prev, o]), []);
  const updateOrderStatus = useCallback((id: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }, []);

  const addCategory = useCallback((name: string) => {
    setCategories((prev) => [...prev, { id: "cat" + Date.now(), name }]);
  }, []);
  const updateCategory = useCallback((id: string, name: string) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
  }, []);
  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return (
    <StoreContext.Provider value={{ products, boxes, orders, categories, addProduct, updateProduct, deleteProduct, addBox, updateBox, deleteBox, addOrder, updateOrderStatus, addCategory, updateCategory, deleteCategory }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};
