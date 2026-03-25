import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Product, Box } from "@/data/products";
import { db } from "@/lib/firebase";
import { collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";

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

interface StoreContextType {
  products: Product[];
  boxes: Box[];
  orders: Order[];
  categories: Category[];
  addProduct: (p: Product) => Promise<void>;
  updateProduct: (p: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addBox: (b: Box) => Promise<void>;
  updateBox: (b: Box) => Promise<void>;
  deleteBox: (id: string) => Promise<void>;
  addOrder: (o: Order) => Promise<void>;
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function toFirestorePayload<T>(value: T): T {
  // Firestore rejects undefined values, so we strip them.
  return JSON.parse(JSON.stringify(value));
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!db) return;

    const productsRef = collection(db, "products");
    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        const remoteProducts = snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as Omit<Product, "id">),
        }));
        setProducts(remoteProducts);
      },
      (error) => {
        console.error("Failed to subscribe to Firestore products", error);
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db) return;

    const boxesRef = collection(db, "boxes");
    const unsubscribe = onSnapshot(
      boxesRef,
      (snapshot) => {
        const remoteBoxes = snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as Omit<Box, "id">),
        }));
        setBoxes(remoteBoxes);
      },
      (error) => {
        console.error("Failed to subscribe to Firestore boxes", error);
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db) return;

    const categoriesRef = collection(db, "categories");
    const unsubscribe = onSnapshot(
      categoriesRef,
      (snapshot) => {
        const remoteCategories = snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as Omit<Category, "id">),
        }));
        setCategories(remoteCategories);
      },
      (error) => {
        console.error("Failed to subscribe to Firestore categories", error);
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db) return;

    const ordersRef = collection(db, "orders");

    const unsubscribe = onSnapshot(
      ordersRef,
      (snapshot) => {
        const remoteOrders = snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as Omit<Order, "id">),
        }));
        setOrders(remoteOrders);
      },
      (error) => {
        console.error("Failed to subscribe to Firestore orders", error);
      },
    );

    return () => unsubscribe();
  }, []);

  const addProduct = useCallback(async (p: Product) => {
    if (!db) throw new Error("Firebase is not configured");
    await setDoc(doc(db, "products", p.id), toFirestorePayload(p), { merge: true });
  }, []);

  const updateProduct = useCallback(async (p: Product) => {
    if (!db) throw new Error("Firebase is not configured");
    await setDoc(doc(db, "products", p.id), toFirestorePayload(p), { merge: true });
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    if (!db) throw new Error("Firebase is not configured");
    await deleteDoc(doc(db, "products", id));
  }, []);

  const addBox = useCallback(async (b: Box) => {
    if (!db) throw new Error("Firebase is not configured");
    await setDoc(doc(db, "boxes", b.id), toFirestorePayload(b), { merge: true });
  }, []);

  const updateBox = useCallback(async (b: Box) => {
    if (!db) throw new Error("Firebase is not configured");
    await setDoc(doc(db, "boxes", b.id), toFirestorePayload(b), { merge: true });
  }, []);

  const deleteBox = useCallback(async (id: string) => {
    if (!db) throw new Error("Firebase is not configured");
    await deleteDoc(doc(db, "boxes", id));
  }, []);

  const addOrder = useCallback(async (o: Order) => {
    if (!db) throw new Error("Firebase is not configured");
    await setDoc(doc(db, "orders", o.id), toFirestorePayload(o), { merge: true });
  }, []);

  const updateOrderStatus = useCallback(async (id: string, status: Order["status"]) => {
    if (!db) throw new Error("Firebase is not configured");
    await setDoc(doc(db, "orders", id), toFirestorePayload({ status }), { merge: true });
  }, []);

  const addCategory = useCallback(async (name: string) => {
    const category = { id: "cat" + Date.now(), name };

    if (!db) throw new Error("Firebase is not configured");
    await setDoc(doc(db, "categories", category.id), toFirestorePayload(category), { merge: true });
  }, []);

  const updateCategory = useCallback(async (id: string, name: string) => {
    if (!db) throw new Error("Firebase is not configured");
    await setDoc(doc(db, "categories", id), toFirestorePayload({ name }), { merge: true });
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    if (!db) throw new Error("Firebase is not configured");
    await deleteDoc(doc(db, "categories", id));
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
