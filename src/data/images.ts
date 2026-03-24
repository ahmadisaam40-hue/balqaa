import logoImage from "@/assets/Screenshot 2026-03-24 181145.png";
import type { Box, Product } from "@/data/products";

export const productImages: Record<string, string> = {
  "1": logoImage,
  "2": logoImage,
  "3": logoImage,
  "4": logoImage,
  "5": logoImage,
  "6": logoImage,
  "7": logoImage,
  "8": logoImage,
};

export const boxImages: Record<string, string> = {
  "b1": logoImage,
  "b2": logoImage,
  "b3": logoImage,
};

export const resolveProductImage = (product: Pick<Product, "id" | "image">) => {
  return product.image || productImages[product.id] || "";
};

export const resolveBoxImage = (box: Pick<Box, "id" | "image">) => {
  return box.image || boxImages[box.id] || "";
};
