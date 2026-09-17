export type CartItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  productType: string;
  packSize: string;
  price: number;
  quantity: number;
  oldPrice?: number;

  // Product-level delivery settings
  deliveryType: "free" | "paid";
  deliveryCharge: number;
};