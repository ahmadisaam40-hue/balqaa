export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "مكياج" | "عناية بالبشرة" | "عطور" | "إكسسوارات";
  description: string;
  hasDiscount: boolean;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  badge?: string;
}

export interface Box {
  id: string;
  name: string;
  items: string[];
  price: number;
  image: string;
  hasDiscount: boolean;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "أحمر شفاه مات فاخر",
    price: 18000,
    image: "",
    category: "مكياج",
    description: "أحمر شفاه مات بتركيبة مخملية تدوم طويلاً",
    hasDiscount: true,
    discountType: "percentage",
    discountValue: 20,
    badge: "عرض",
  },
  {
    id: "2",
    name: "كريم مرطب بالكولاجين",
    price: 25000,
    image: "",
    category: "عناية بالبشرة",
    description: "كريم مرطب غني بالكولاجين لبشرة نضرة ومشرقة",
    hasDiscount: false,
    badge: "جديد",
  },
  {
    id: "3",
    name: "عطر زهور الربيع",
    price: 45000,
    image: "",
    category: "عطور",
    description: "عطر نسائي فاخر بنفحات الزهور والفانيلا",
    hasDiscount: true,
    discountType: "fixed",
    discountValue: 10000,
  },
  {
    id: "4",
    name: "باليت ظلال عيون",
    price: 22000,
    image: "",
    category: "مكياج",
    description: "باليت ظلال عيون بـ 12 لون ترابي وبراق",
    hasDiscount: false,
  },
  {
    id: "5",
    name: "سيروم فيتامين سي",
    price: 30000,
    image: "",
    category: "عناية بالبشرة",
    description: "سيروم مركز بفيتامين سي لتفتيح وتوحيد لون البشرة",
    hasDiscount: true,
    discountType: "percentage",
    discountValue: 15,
    badge: "الأكثر مبيعاً",
  },
  {
    id: "6",
    name: "طقم أساور ذهبية",
    price: 15000,
    image: "",
    category: "إكسسوارات",
    description: "طقم أساور ذهبية أنيقة مكون من 3 قطع",
    hasDiscount: false,
    badge: "جديد",
  },
  {
    id: "7",
    name: "كريم أساس فل كفر",
    price: 20000,
    image: "",
    category: "مكياج",
    description: "كريم أساس بتغطية كاملة وتركيبة خفيفة",
    hasDiscount: true,
    discountType: "percentage",
    discountValue: 25,
    badge: "عرض",
  },
  {
    id: "8",
    name: "عطر عود ملكي",
    price: 55000,
    image: "",
    category: "عطور",
    description: "عطر فاخر بمزيج العود والمسك الملكي",
    hasDiscount: false,
  },
];

export const boxes: Box[] = [
  {
    id: "b1",
    name: "بوكس العروس الذهبي",
    items: ["أحمر شفاه", "باليت ظلال", "كريم أساس", "عطر"],
    price: 85000,
    image: "",
    hasDiscount: true,
    discountType: "percentage",
    discountValue: 10,
  },
  {
    id: "b2",
    name: "بوكس العناية اليومية",
    items: ["كريم مرطب", "سيروم فيتامين سي", "غسول وجه"],
    price: 60000,
    image: "",
    hasDiscount: false,
  },
  {
    id: "b3",
    name: "بوكس الهدية الأنيقة",
    items: ["عطر", "كريم يد", "شمعة معطرة"],
    price: 50000,
    image: "",
    hasDiscount: true,
    discountType: "fixed",
    discountValue: 8000,
  },
];

export const categories = ["الكل", "مكياج", "عناية بالبشرة", "عطور", "إكسسوارات"] as const;
