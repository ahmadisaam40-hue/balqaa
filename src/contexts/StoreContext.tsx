import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Product, Box, products as defaultProducts, boxes as defaultBoxes, categories as defaultCategoriesConst } from "@/data/products";
import { db } from "@/lib/firebase";
import { collection, deleteDoc, doc, getDoc, getDocsFromServer, onSnapshot, setDoc } from "firebase/firestore";

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
    let isMounted = true;
    let unsubscribe = () => {};

    const initialize = async () => {
      try {
        const seedRef = doc(db, "__meta", "seed");
        const seedDoc = await getDoc(seedRef);
        const isSeeded = seedDoc.exists() && Boolean(seedDoc.data()?.productsSeeded);
        const serverSnapshot = await getDocsFromServer(productsRef);
        console.log("[Products] Seed marker exists:", seedDoc.exists());
        console.log("[Products] Is seeded:", isSeeded);
        console.log("[Products] Server snapshot empty:", serverSnapshot.empty);
        console.log("[Products] Server docs count:", serverSnapshot.size);
        if (!isSeeded && serverSnapshot.empty) {
          console.log("[Products] Seeding default products...");
          await Promise.all(
            defaultProducts.map((product) =>
              setDoc(doc(productsRef, product.id), toFirestorePayload(product), { merge: true }),
            ),
          );
          await setDoc(seedRef, { productsSeeded: true }, { merge: true });
          console.log("[Products] Seeding complete, seed marker written");
        } else if (!isSeeded && !serverSnapshot.empty) {
          // Existing projects may already have products without the seed marker.
          console.log("[Products] Writing seed marker for existing data");
          await setDoc(seedRef, { productsSeeded: true }, { merge: true });
        } else {
          console.log("[Products] Already seeded, skipping initialization");
        }
      } catch (error) {
        console.error("Failed to initialize Firestore products", error);
      }

      if (!isMounted) return;

      unsubscribe = onSnapshot(
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
    };

    initialize();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!db) return;

    const boxesRef = collection(db, "boxes");
    let isMounted = true;
    let unsubscribe = () => {};

    const initialize = async () => {
      try {
        const seedRef = doc(db, "__meta", "seed");
        const seedDoc = await getDoc(seedRef);
        const isSeeded = seedDoc.exists() && Boolean(seedDoc.data()?.boxesSeeded);
        const serverSnapshot = await getDocsFromServer(boxesRef);
        console.log("[Boxes] Seed marker exists:", seedDoc.exists());
        console.log("[Boxes] Is seeded:", isSeeded);
        console.log("[Boxes] Server snapshot empty:", serverSnapshot.empty);
        console.log("[Boxes] Server docs count:", serverSnapshot.size);
        if (!isSeeded && serverSnapshot.empty) {
          console.log("[Boxes] Seeding default boxes...");
          await Promise.all(
            defaultBoxes.map((box) =>
              setDoc(doc(boxesRef, box.id), toFirestorePayload(box), { merge: true }),
            ),
          );
          await setDoc(seedRef, { boxesSeeded: true }, { merge: true });
          console.log("[Boxes] Seeding complete, seed marker written");
        } else if (!isSeeded && !serverSnapshot.empty) {
          console.log("[Boxes] Writing seed marker for existing data");
          await setDoc(seedRef, { boxesSeeded: true }, { merge: true });
        } else {
          console.log("[Boxes] Already seeded, skipping initialization");
        }
      } catch (error) {
        console.error("Failed to initialize Firestore boxes", error);
      }

      if (!isMounted) return;

      unsubscribe = onSnapshot(
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
    };

    initialize();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!db) return;

    const categoriesRef = collection(db, "categories");
    let isMounted = true;
    let unsubscribe = () => {};

    const initialize = async () => {
      try {
        const seedRef = doc(db, "__meta", "seed");
        const seedDoc = await getDoc(seedRef);
        const isSeeded = seedDoc.exists() && Boolean(seedDoc.data()?.categoriesSeeded);
        const serverSnapshot = await getDocsFromServer(categoriesRef);
        console.log("[Categories] Seed marker exists:", seedDoc.exists());
        console.log("[Categories] Is seeded:", isSeeded);
        console.log("[Categories] Server snapshot empty:", serverSnapshot.empty);
        console.log("[Categories] Server docs count:", serverSnapshot.size);
        if (!isSeeded && serverSnapshot.empty) {
          console.log("[Categories] Seeding default categories...");
          await Promise.all(
            defaultCategories.map((category) =>
              setDoc(doc(categoriesRef, category.id), toFirestorePayload(category), { merge: true }),
            ),
          );
          await setDoc(seedRef, { categoriesSeeded: true }, { merge: true });
          console.log("[Categories] Seeding complete, seed marker written");
        } else if (!isSeeded && !serverSnapshot.empty) {
          console.log("[Categories] Writing seed marker for existing data");
          await setDoc(seedRef, { categoriesSeeded: true }, { merge: true });
        } else {
          console.log("[Categories] Already seeded, skipping initialization");
        }
      } catch (error) {
        console.error("Failed to initialize Firestore categories", error);
      }

      if (!isMounted) return;

      unsubscribe = onSnapshot(
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
    };

    initialize();

    return () => {
      isMounted = false;
      unsubscribe();
    };
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

  const addProduct = useCallback((p: Product) => {
    setProducts((prev) => [...prev, p]);

    if (!db) return;
    setDoc(doc(db, "products", p.id), toFirestorePayload(p), { merge: true }).catch((error) => {
      console.error("Failed to add product in Firestore", error);
    });
  }, []);

  const updateProduct = useCallback((p: Product) => {
    setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)));

    if (!db) return;
    setDoc(doc(db, "products", p.id), toFirestorePayload(p), { merge: true }).catch((error) => {
      console.error("Failed to update product in Firestore", error);
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((x) => x.id !== id));

    if (!db) return;
    deleteDoc(doc(db, "products", id)).catch((error) => {
      console.error("Failed to delete product in Firestore", error);
    });
  }, []);

  const addBox = useCallback((b: Box) => {
    setBoxes((prev) => [...prev, b]);

    if (!db) return;
    setDoc(doc(db, "boxes", b.id), toFirestorePayload(b), { merge: true }).catch((error) => {
      console.error("Failed to add box in Firestore", error);
    });
  }, []);

  const updateBox = useCallback((b: Box) => {
    setBoxes((prev) => prev.map((x) => (x.id === b.id ? b : x)));

    if (!db) return;
    setDoc(doc(db, "boxes", b.id), toFirestorePayload(b), { merge: true }).catch((error) => {
      console.error("Failed to update box in Firestore", error);
    });
  }, []);

  const deleteBox = useCallback((id: string) => {
    setBoxes((prev) => prev.filter((x) => x.id !== id));

    if (!db) return;
    deleteDoc(doc(db, "boxes", id)).catch((error) => {
      console.error("Failed to delete box in Firestore", error);
    });
  }, []);

  const addOrder = useCallback((o: Order) => {
    setOrders((prev) => [...prev, o]);

    if (!db) return;
    setDoc(doc(db, "orders", o.id), toFirestorePayload(o), { merge: true }).catch((error) => {
      console.error("Failed to add order in Firestore", error);
    });
  }, []);

  const updateOrderStatus = useCallback((id: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

    if (!db) return;
    setDoc(doc(db, "orders", id), toFirestorePayload({ status }), { merge: true }).catch((error) => {
      console.error("Failed to update order status in Firestore", error);
    });
  }, []);

  const addCategory = useCallback((name: string) => {
    const category = { id: "cat" + Date.now(), name };
    setCategories((prev) => [...prev, category]);

    if (!db) return;
    setDoc(doc(db, "categories", category.id), toFirestorePayload(category), { merge: true }).catch((error) => {
      console.error("Failed to add category in Firestore", error);
    });
  }, []);

  const updateCategory = useCallback((id: string, name: string) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));

    if (!db) return;
    setDoc(doc(db, "categories", id), toFirestorePayload({ name }), { merge: true }).catch((error) => {
      console.error("Failed to update category in Firestore", error);
    });
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));

    if (!db) return;
    deleteDoc(doc(db, "categories", id)).catch((error) => {
      console.error("Failed to delete category in Firestore", error);
    });
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
