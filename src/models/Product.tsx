import mongoose, {
  Document,
  Model,
  Schema,
  Types,
} from "mongoose";

export interface IProductVariant {
  _id?: Types.ObjectId;
  packSize?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku: string;
  isActive: boolean;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: Types.ObjectId;

  productType:
    | "Phase 1"
    | "Phase 2"
    | "Complete Pack"
    | "Single Seed";

  shortDescription?: string;
  description?: string;

  images: string[];

  price?: number;
  compareAtPrice?: number;
  stock?: number;
  sku?: string;

  variants: IProductVariant[];

  // =========================
  // DELIVERY
  // =========================
  deliveryType: "free" | "paid";
  deliveryCharge: number;

  ingredients: string[];
  benefits: string[];
  howToUse: string[];

  isFeatured: boolean;
  isActive: boolean;

  seo: {
    title?: string;
    description?: string;
    keywords: string[];
  };

  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema =
  new Schema<IProductVariant>(
    {
      packSize: {
        type: String,
        trim: true,
      },

      price: {
        type: Number,
        required: true,
        min: 0,
      },

      compareAtPrice: {
        type: Number,
        min: 0,
      },

      stock: {
        type: Number,
        required: true,
        min: 0,
      },

      sku: {
        type: String,
        required: true,
        trim: true,
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      _id: true,
    }
  );

const ProductSchema =
  new Schema<IProduct>(
    {
      name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
      },

      slug: {
        type: String,
        required: [true, "Product slug is required"],
        unique: true,
        trim: true,
        lowercase: true,
      },

      category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category is required"],
      },

      productType: {
        type: String,
        enum: [
          "Phase 1",
          "Phase 2",
          "Complete Pack",
          "Single Seed",
        ],
        required: true,
      },

      shortDescription: {
        type: String,
        trim: true,
      },

      description: {
        type: String,
        trim: true,
      },

      images: {
        type: [String],
        default: [],
      },

      price: {
        type: Number,
        min: 0,
      },

      compareAtPrice: {
        type: Number,
        min: 0,
      },

      stock: {
        type: Number,
        min: 0,
      },

      sku: {
        type: String,
        trim: true,
      },

      variants: {
        type: [ProductVariantSchema],
        default: [],
      },

      // =========================
      // DELIVERY
      // =========================

      deliveryType: {
        type: String,
        enum: {
          values: ["free", "paid"],
          message:
            "Delivery type must be free or paid",
        },
        default: "free",
        required: true,
        index: true,
      },

      deliveryCharge: {
        type: Number,
        default: 0,
        min: [
          0,
          "Delivery charge cannot be negative",
        ],
        required: true,
      },

      ingredients: {
        type: [String],
        default: [],
      },

      benefits: {
        type: [String],
        default: [],
      },

      howToUse: {
        type: [String],
        default: [],
      },

      isFeatured: {
        type: Boolean,
        default: false,
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      seo: {
        title: {
          type: String,
          trim: true,
        },

        description: {
          type: String,
          trim: true,
        },

        keywords: {
          type: [String],
          default: [],
        },
      },
    },
    {
      timestamps: true,
      strict: true,
    }
  );



const Product: Model<IProduct> =
  mongoose.models.Product ||
  mongoose.model<IProduct>(
    "Product",
    ProductSchema
  );

export default Product;