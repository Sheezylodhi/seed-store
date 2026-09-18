export type CartItem = {
  id: string;
    // Actual MongoDB Product ID
  productId: string;

  // Selected product variant ID, if applicable
  variantId?: string | null;
  
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