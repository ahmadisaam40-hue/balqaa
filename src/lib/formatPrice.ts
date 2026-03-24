export function formatPrice(price: number): string {
  return price.toLocaleString("ar-IQ") + " د.ع";
}

export function calculateFinalPrice(
  price: number,
  hasDiscount: boolean,
  discountType?: "percentage" | "fixed",
  discountValue?: number
): number {
  if (!hasDiscount || !discountType || !discountValue) return price;
  if (discountType === "percentage") {
    return Math.round(price - (price * discountValue) / 100);
  }
  return Math.round(price - discountValue);
}

export function getDiscountLabel(
  discountType: "percentage" | "fixed",
  discountValue: number
): string {
  if (discountType === "percentage") return `-${discountValue}%`;
  return `-${formatPrice(discountValue)}`;
}
