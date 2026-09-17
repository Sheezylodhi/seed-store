import { NextRequest, NextResponse } from "next/server";

import mongoose from "mongoose";

import { connectDB } from "@/lib/db";

import cloudinary from "@/lib/cloudinary";

import Product from "@/models/Product";

import Order from "@/models/Order";

import Coupon from "@/models/Coupon";

export const runtime = "nodejs";

type PaymentMethod =
  | "cod"
  | "bank_transfer"
  | "jazzcash"
  | "easypaisa";

const allowedPaymentMethods: PaymentMethod[] = [
  "cod",
  "bank_transfer",
  "jazzcash",
  "easypaisa",
];

type IncomingItem = {
  id: string;
  quantity: number;
  packSize?: string;
};

function cleanString(
  value: FormDataEntryValue | null
) {
  if (
    value === null ||
    typeof value !== "string"
  ) {
    return "";
  }

  return value.trim();
}

function calculateCouponDiscount(
  coupon: any,
  subtotal: number
) {
  let discount = 0;

  if (
    coupon.discountType === "percentage"
  ) {
    discount =
      (subtotal *
        Number(coupon.discountValue)) /
      100;

    if (
      coupon.maximumDiscountAmount !==
        undefined &&
      coupon.maximumDiscountAmount !== null
    ) {
      discount = Math.min(
        discount,
        Number(
          coupon.maximumDiscountAmount
        )
      );
    }
  }

  if (
    coupon.discountType === "fixed"
  ) {
    discount = Number(
      coupon.discountValue
    );
  }

  discount = Math.min(
    discount,
    subtotal
  );

  return Math.max(
    Math.round(discount),
    0
  );
}

/*
|--------------------------------------------------------------------------
| DELIVERY
|--------------------------------------------------------------------------
|
| Delivery is calculated from the actual products in MongoDB.
|
| Rules:
| - All products free delivery => Rs. 0
| - If any product has paid delivery => highest paid delivery charge
| - Delivery is charged once per order, not per quantity
| - Client-side delivery values are NOT trusted
|
*/

function getProductDeliveryCharge(
  product: any
) {
  const deliveryType =
    product?.deliveryType === "paid"
      ? "paid"
      : "free";

  if (deliveryType !== "paid") {
    return 0;
  }

  const charge = Number(
    product?.deliveryCharge
  );

  if (
    !Number.isFinite(charge) ||
    charge < 0
  ) {
    return 0;
  }

  return charge;
}

/*
|--------------------------------------------------------------------------
| CLOUDINARY PAYMENT SCREENSHOT
|--------------------------------------------------------------------------
*/

async function uploadPaymentScreenshot(
  file: File
) {
  const arrayBuffer =
    await file.arrayBuffer();

  const buffer = Buffer.from(
    arrayBuffer
  );

  return new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder:
            "seedra/payment-proofs",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (
            !result?.secure_url ||
            !result?.public_id
          ) {
            reject(
              new Error(
                "Cloudinary upload failed"
              )
            );

            return;
          }

          resolve({
            secure_url:
              result.secure_url,
            public_id:
              result.public_id,
          });
        }
      );

    uploadStream.end(buffer);
  });
}

/*
|--------------------------------------------------------------------------
| POST /api/orders
|--------------------------------------------------------------------------
*/

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const formData =
      await request.formData();

    /*
    |--------------------------------------------------------------------------
    | BASIC DATA
    |--------------------------------------------------------------------------
    */

    let customerInfo: any;
    let shippingAddress: any;
    let items: IncomingItem[];

    try {
      customerInfo = JSON.parse(
        String(
          formData.get(
            "customerInfo"
          ) || "{}"
        )
      );

      shippingAddress = JSON.parse(
        String(
          formData.get(
            "shippingAddress"
          ) || "{}"
        )
      );

      items = JSON.parse(
        String(
          formData.get("items") ||
            "[]"
        )
      );
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid checkout data.",
        },
        { status: 400 }
      );
    }

    const paymentMethod =
      String(
        formData.get(
          "paymentMethod"
        ) || "cod"
      ) as PaymentMethod;

    const couponCode =
      cleanString(
        formData.get(
          "couponCode"
        )
      ).toUpperCase();

    const notes =
      cleanString(
        formData.get("notes")
      );

    const paymentScreenshot =
      formData.get(
        "paymentScreenshot"
      );

    /*
    |--------------------------------------------------------------------------
    | PAYMENT METHOD
    |--------------------------------------------------------------------------
    */

    if (
      !allowedPaymentMethods.includes(
        paymentMethod
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid payment method.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | CUSTOMER VALIDATION
    |--------------------------------------------------------------------------
    */

    if (
      !customerInfo?.firstName ||
      !customerInfo?.lastName ||
      !customerInfo?.email ||
      !customerInfo?.phone
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Customer information is incomplete.",
        },
        { status: 400 }
      );
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        String(
          customerInfo.email
        ).trim()
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | ADDRESS VALIDATION
    |--------------------------------------------------------------------------
    */

    if (
      !shippingAddress?.address ||
      !shippingAddress?.city
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Shipping address is incomplete.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | ITEMS VALIDATION
    |--------------------------------------------------------------------------
    */

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | PAYMENT SCREENSHOT VALIDATION
    |--------------------------------------------------------------------------
    */

    if (
      paymentMethod !== "cod"
    ) {
      if (
        !paymentScreenshot ||
        !(paymentScreenshot instanceof File)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Please upload your payment screenshot.",
          },
          { status: 400 }
        );
      }

      if (
        ![
          "image/jpeg",
          "image/png",
          "image/webp",
        ].includes(
          paymentScreenshot.type
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Payment proof must be a JPG, PNG or WEBP image.",
          },
          { status: 400 }
        );
      }

      if (
        paymentScreenshot.size >
        5 * 1024 * 1024
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Payment screenshot must be smaller than 5MB.",
          },
          { status: 400 }
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | BUILD ORDER ITEMS FROM DATABASE
    |--------------------------------------------------------------------------
    */

    let subtotal = 0;

    const orderItems: any[] = [];

    /*
    |--------------------------------------------------------------------------
    | DELIVERY CALCULATION
    |--------------------------------------------------------------------------
    |
    | We calculate this from MongoDB product data.
    |
    */

    const productDeliveryCharges: number[] =
      [];

    for (const item of items) {
      /*
      |--------------------------------------------------------------------------
      | PRODUCT ID
      |--------------------------------------------------------------------------
      */

      if (
        !item?.id ||
        !mongoose.Types.ObjectId.isValid(
          item.id
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid product.",
          },
          { status: 400 }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | QUANTITY
      |--------------------------------------------------------------------------
      */

      const quantity =
        Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid product quantity.",
          },
          { status: 400 }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | PRODUCT
      |--------------------------------------------------------------------------
      */

      const product =
        await Product.findById(
          item.id
        );

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message:
              "One of the products no longer exists.",
          },
          { status: 400 }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | ACTIVE CHECK
      |--------------------------------------------------------------------------
      */

      if (
        (product as any).isActive ===
        false
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `${product.name} is no longer available.`,
          },
          { status: 400 }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | DELIVERY
      |--------------------------------------------------------------------------
      |
      | Read directly from database.
      |
      */

      const productDeliveryCharge =
        getProductDeliveryCharge(
          product
        );

      if (
        productDeliveryCharge > 0
      ) {
        productDeliveryCharges.push(
          productDeliveryCharge
        );
      }

      /*
      |--------------------------------------------------------------------------
      | PRICE / STOCK / VARIANT
      |--------------------------------------------------------------------------
      */

      let price = 0;

      let stock = 0;

      let sku:
        | string
        | undefined;

      let packSize:
        | string
        | undefined;

      let variantId:
        | mongoose.Types.ObjectId
        | undefined;

      const variants =
        Array.isArray(
          (product as any).variants
        )
          ? (product as any).variants
          : [];

      /*
      |--------------------------------------------------------------------------
      | VARIANT PRODUCT
      |--------------------------------------------------------------------------
      */

      if (
        variants.length > 0
      ) {
        const variant =
          variants.find(
            (v: any) =>
              v.packSize ===
              item.packSize
          );

        if (!variant) {
          return NextResponse.json(
            {
              success: false,
              message: `${product.name} variant is no longer available.`,
            },
            { status: 400 }
          );
        }

        if (
          variant.isActive ===
          false
        ) {
          return NextResponse.json(
            {
              success: false,
              message: `${product.name} variant is no longer available.`,
            },
            { status: 400 }
          );
        }

        price = Number(
          variant.price || 0
        );

        stock = Number(
          variant.stock || 0
        );

        sku =
          variant.sku ||
          undefined;

        packSize =
          variant.packSize ||
          item.packSize ||
          undefined;

        if (variant._id) {
          variantId =
            variant._id;
        }
      } else {
        /*
        |--------------------------------------------------------------------------
        | SIMPLE PRODUCT
        |--------------------------------------------------------------------------
        */

        price = Number(
          (product as any).price ||
            0
        );

        stock = Number(
          (product as any).stock ||
            0
        );

        sku =
          (product as any).sku ||
          undefined;

        packSize =
          item.packSize ||
          (product as any)
            .packSize ||
          undefined;
      }

      /*
      |--------------------------------------------------------------------------
      | PRICE VALIDATION
      |--------------------------------------------------------------------------
      */

      if (
        !Number.isFinite(price) ||
        price < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid price for ${product.name}.`,
          },
          { status: 400 }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | STOCK VALIDATION
      |--------------------------------------------------------------------------
      */

      if (
        stock < quantity
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `${product.name} does not have enough stock.`,
          },
          { status: 400 }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | LINE TOTAL
      |--------------------------------------------------------------------------
      */

      const lineTotal =
        price * quantity;

      subtotal += lineTotal;

      /*
      |--------------------------------------------------------------------------
      | ORDER ITEM
      |--------------------------------------------------------------------------
      */

      orderItems.push({
        product:
          product._id,

        variantId,

        name:
          product.name,

        packSize,

        sku,

        price,

        quantity,

        image:
          (product as any)
            .images?.[0]?.url ||
          (product as any)
            .images?.[0] ||
          (product as any)
            .image ||
          undefined,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | COUPON
    |--------------------------------------------------------------------------
    */

    let discount = 0;

    let appliedCoupon:
      | {
          id: mongoose.Types.ObjectId;
          code: string;
          discount: number;
        }
      | null = null;

    if (couponCode) {
      const coupon =
        await Coupon.findOne({
          code: couponCode,
          isActive: true,
        });

      if (!coupon) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This coupon is no longer available.",
          },
          { status: 400 }
        );
      }

      const now =
        new Date();

      /*
      |--------------------------------------------------------------------------
      | COUPON EXPIRY
      |--------------------------------------------------------------------------
      */

      if (
        coupon.expiresAt &&
        new Date(
          coupon.expiresAt
        ) <= now
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This coupon has expired.",
          },
          { status: 400 }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | COUPON USAGE LIMIT
      |--------------------------------------------------------------------------
      */

      if (
        coupon.usageLimit !==
          undefined &&
        coupon.usageLimit !==
          null &&
        coupon.usedCount >=
          coupon.usageLimit
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This coupon has already reached its usage limit.",
          },
          { status: 400 }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | MINIMUM ORDER AMOUNT
      |--------------------------------------------------------------------------
      */

      if (
        coupon.minimumOrderAmount !==
          undefined &&
        coupon.minimumOrderAmount !==
          null &&
        subtotal <
          coupon.minimumOrderAmount
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `This coupon requires a minimum order of PKR ${coupon.minimumOrderAmount.toLocaleString()}.`,
          },
          { status: 400 }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | CALCULATE DISCOUNT
      |--------------------------------------------------------------------------
      */

      discount =
        calculateCouponDiscount(
          coupon,
          subtotal
        );

      if (discount <= 0) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This coupon cannot be applied to this order.",
          },
          { status: 400 }
        );
      }

      appliedCoupon = {
        id: coupon._id,
        code: coupon.code,
        discount,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | DELIVERY
    |--------------------------------------------------------------------------
    |
    | Highest paid product delivery charge wins.
    |
    | Example:
    |
    | Product A = Free
    | Product B = Rs. 250
    | Product C = Rs. 350
    |
    | Final delivery = Rs. 350
    |
    | Quantity does NOT multiply delivery.
    |
    */

    const deliveryCharge =
      productDeliveryCharges.length >
      0
        ? Math.max(
            ...productDeliveryCharges
          )
        : 0;

    /*
    |--------------------------------------------------------------------------
    | TOTAL
    |--------------------------------------------------------------------------
    */

    const total = Math.max(
      subtotal -
        discount +
        deliveryCharge,
      0
    );

    /*
    |--------------------------------------------------------------------------
    | UPLOAD PAYMENT SCREENSHOT
    |--------------------------------------------------------------------------
    */

    let screenshotUrl:
      | string
      | undefined;

    let screenshotPublicId:
      | string
      | undefined;

    if (
      paymentMethod !== "cod" &&
      paymentScreenshot instanceof File
    ) {
      try {
        const upload =
          await uploadPaymentScreenshot(
            paymentScreenshot
          );

        screenshotUrl =
          upload.secure_url;

        screenshotPublicId =
          upload.public_id;
      } catch (error) {
        console.error(
          "Payment screenshot upload error:",
          error
        );

        return NextResponse.json(
          {
            success: false,
            message:
              "Failed to upload payment screenshot. Please try again.",
          },
          { status: 500 }
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | ORDER NUMBER
    |--------------------------------------------------------------------------
    */

    let orderNumber = "";

    for (
      let attempt = 0;
      attempt < 10;
      attempt++
    ) {
      const candidate =
        `SDR-${Date.now()
          .toString()
          .slice(-8)}-${Math.floor(
          1000 +
            Math.random() * 9000
        )}`;

      const exists =
        await Order.exists({
          orderNumber:
            candidate,
        });

      if (!exists) {
        orderNumber =
          candidate;

        break;
      }
    }

    if (!orderNumber) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to generate order number. Please try again.",
        },
        { status: 500 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE ORDER
    |--------------------------------------------------------------------------
    */

    const order =
      await Order.create({
        orderNumber,

        customerInfo: {
          firstName:
            customerInfo.firstName.trim(),

          lastName:
            customerInfo.lastName.trim(),

          email:
            customerInfo.email
              ?.trim()
              .toLowerCase() ||
            undefined,

          phone:
            customerInfo.phone.trim(),
        },

        shippingAddress: {
          firstName:
            shippingAddress.firstName ||
            customerInfo.firstName.trim(),

          lastName:
            shippingAddress.lastName ||
            customerInfo.lastName.trim(),

          address:
            shippingAddress.address.trim(),

          apartment:
            shippingAddress.apartment
              ?.trim() ||
            undefined,

          city:
            shippingAddress.city.trim(),

          postalCode:
            shippingAddress.postalCode
              ?.trim() ||
            undefined,

          country:
            shippingAddress.country ||
            "Pakistan",

          phone:
            shippingAddress.phone
              ?.trim() ||
            customerInfo.phone.trim(),
        },

        billingAddressSameAsShipping:
          true,

        items:
          orderItems,

        subtotal,

        discount,

        deliveryCharge,

        total,

        ...(appliedCoupon
          ? {
              coupon: {
                code:
                  appliedCoupon.code,

                discount:
                  appliedCoupon.discount,
              },
            }
          : {}),

        paymentMethod,

        /*
         * Every order starts as pending.
         * Manual payment is verified by admin.
         */

        paymentStatus:
          "pending",

        ...(paymentMethod !==
        "cod"
          ? {
              payment: {
                gateway:
                  paymentMethod,

                screenshotUrl,

                screenshotPublicId,

                submittedAt:
                  new Date(),
              },
            }
          : {}),

        orderStatus:
          "pending",

        trackingHistory: [
          {
            status:
              "pending",

            note:
              "Order placed successfully",

            createdAt:
              new Date(),
          },
        ],

        notes:
          notes || undefined,
      });

    /*
    |--------------------------------------------------------------------------
    | REDUCE STOCK
    |--------------------------------------------------------------------------
    */

    for (const item of items) {
      const product =
        await Product.findById(
          item.id
        );

      if (!product) {
        continue;
      }

      const variants =
        Array.isArray(
          (product as any).variants
        )
          ? (product as any).variants
          : [];

      if (
        variants.length > 0
      ) {
        const variant =
          variants.find(
            (v: any) =>
              v.packSize ===
              item.packSize
          );

        if (variant) {
          variant.stock =
            Math.max(
              0,
              Number(
                variant.stock || 0
              ) -
                Number(
                  item.quantity
                )
            );
        }
      } else {
        (product as any).stock =
          Math.max(
            0,
            Number(
              (product as any)
                .stock || 0
            ) -
              Number(
                item.quantity
              )
          );
      }

      await product.save();
    }

    /*
    |--------------------------------------------------------------------------
    | MARK COUPON USED
    |--------------------------------------------------------------------------
    |
    | Coupon is counted ONLY after order creation.
    |
    */

    if (appliedCoupon) {
      await Coupon.findOneAndUpdate(
        {
          _id:
            appliedCoupon.id,

          isActive: true,

          $or: [
            {
              usageLimit: {
                $exists: false,
              },
            },

            {
              usageLimit: null,
            },

            {
              $expr: {
                $lt: [
                  "$usedCount",
                  "$usageLimit",
                ],
              },
            },
          ],
        },
        {
          $inc: {
            usedCount: 1,
          },
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    return NextResponse.json(
      {
        success: true,

        message:
          paymentMethod === "cod"
            ? "Order placed successfully."
            : "Order placed successfully. Your payment proof is pending verification.",

        order: {
          orderNumber:
            order.orderNumber,

          paymentMethod:
            order.paymentMethod,

          paymentStatus:
            order.paymentStatus,

          subtotal:
            order.subtotal,

          discount:
            order.discount,

          deliveryCharge:
            order.deliveryCharge,

          total:
            order.total,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to create your order.",
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| GET /api/orders?order=SDR-XXXXXXXX-XXXX
|--------------------------------------------------------------------------
*/

export async function GET(
  request: NextRequest
) {
  try {
    await connectDB();

    const {
      searchParams,
    } = new URL(request.url);

    const orderNumber =
      searchParams
        .get("order")
        ?.trim();

    if (!orderNumber) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order number is required.",
        },
        { status: 400 }
      );
    }

    const order =
      await Order.findOne({
        orderNumber,
      }).lean();

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,

        order: {
          id: String(
            order._id
          ),

          orderNumber:
            order.orderNumber,

          customerInfo: {
            firstName:
              order.customerInfo
                ?.firstName || "",

            lastName:
              order.customerInfo
                ?.lastName || "",

            email:
              order.customerInfo
                ?.email || "",

            phone:
              order.customerInfo
                ?.phone || "",
          },

          shippingAddress: {
            firstName:
              order.shippingAddress
                ?.firstName || "",

            lastName:
              order.shippingAddress
                ?.lastName || "",

            address:
              order.shippingAddress
                ?.address || "",

            apartment:
              order.shippingAddress
                ?.apartment || "",

            city:
              order.shippingAddress
                ?.city || "",

            state:
              order.shippingAddress
                ?.state || "",

            postalCode:
              order.shippingAddress
                ?.postalCode || "",

            country:
              order.shippingAddress
                ?.country ||
              "Pakistan",

            phone:
              order.shippingAddress
                ?.phone ||
              order.customerInfo
                ?.phone ||
              "",
          },

          items:
            (order.items || []).map(
              (item: any) => ({
                product:
                  String(
                    item.product
                  ),

                variantId:
                  item.variantId
                    ? String(
                        item.variantId
                      )
                    : undefined,

                name:
                  item.name,

                packSize:
                  item.packSize ||
                  undefined,

                sku:
                  item.sku ||
                  undefined,

                price:
                  Number(
                    item.price || 0
                  ),

                quantity:
                  Number(
                    item.quantity || 0
                  ),

                image:
                  item.image ||
                  undefined,
              })
            ),

          subtotal:
            Number(
              order.subtotal || 0
            ),

          discount:
            Number(
              order.discount || 0
            ),

          deliveryCharge:
            Number(
              order.deliveryCharge ||
                0
            ),

          total:
            Number(
              order.total || 0
            ),

          coupon:
            order.coupon
              ? {
                  code:
                    order.coupon
                      .code,

                  discount:
                    Number(
                      order.coupon
                        .discount ||
                        0
                    ),
                }
              : undefined,

          paymentMethod:
            order.paymentMethod ||
            "cod",

          paymentStatus:
            order.paymentStatus ||
            "pending",

          payment:
            order.payment
              ? {
                  gateway:
                    order.payment
                      .gateway ||
                    undefined,

                  screenshotUrl:
                    order.payment
                      .screenshotUrl ||
                    undefined,

                  submittedAt:
                    order.payment
                      .submittedAt
                      ? new Date(
                          order.payment
                            .submittedAt
                        ).toISOString()
                      : undefined,

                  paidAt:
                    order.payment.paidAt
                      ? new Date(
                          order.payment
                            .paidAt
                        ).toISOString()
                      : undefined,
                }
              : undefined,

          orderStatus:
            order.orderStatus ||
            "pending",

          trackingHistory:
            (
              order.trackingHistory ||
              []
            ).map(
              (history: any) => ({
                status:
                  history.status,

                note:
                  history.note ||
                  undefined,

                location:
                  history.location ||
                  undefined,

                createdAt:
                  history.createdAt
                    ? new Date(
                        history.createdAt
                      ).toISOString()
                    : new Date().toISOString(),
              })
            ),

          notes:
            order.notes ||
            undefined,

          createdAt:
            order.createdAt
              ? new Date(
                  order.createdAt
                ).toISOString()
              : new Date().toISOString(),
        },
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(
      "GET /api/orders error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to load order.",
      },
      {
        status: 500,
      }
    );
  }
}