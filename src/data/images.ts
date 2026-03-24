import type { Box, Product } from "@/data/products";

export const productImages: Record<string, string> = {
  "1": "",
  "2": "",
  "3": "",
  "4": "",
  "5": "",
  "6": "",
  "7": "",
  "8": "",
};

export const boxImages: Record<string, string> = {
  "b1": "",
  "b2": "",
  "b3": "",
};

export const resolveProductImage = (product: Pick<Product, "id" | "image">) => {
  return product.image || productImages[product.id] || "";
};

export const resolveBoxImage = (box: Pick<Box, "id" | "image">) => {
  return box.image || boxImages[box.id] || "";
};
