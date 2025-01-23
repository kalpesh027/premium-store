import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Name"],
    },
    description: {
      type: String,
      required: [true, "Please enter Description"],
    },
    photos: [
      {
        public_id: {
          type: String,
          required: [true, "Please enter Public Id"],
        },
        url: {
          type: String,
          required: [true, "Please enter Url"],
        },
      },
    ],
    price: {
      type: Number,
      required: [true, "Please enter Price"],
    },
    salePrice: {
      type: Number,
    },
    stock: {
      type: Number,
      required: [true, "Please enter Stock"],
    },
    category: {
      type: String,
      required: [true, "Please enter Category"],
      trim: true,
    },
    subcategory: [
      { 
        type: String, 
        trim: true 
      }
    ],
    variants: [
      {
        color: {
          name: String,
          code: String,
        },
        sizes: [
          {
            size: { type: String, enum: ["XS", "S", "M", "L", "XL"] },
            stock: Number,
          },
        ],
      },
    ],
    ratings: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    inStock: {
      type: Boolean,
      default: true,
    },
    shipping: {
      freeShipping: {
        type: Boolean,
        default: false,
      },
      deliveryTime: {
        type: String,
      },
    },
    returnPolicy: {
      allowed: {
        type: Boolean,
        default: true,
      },
      daysLimit: {
        type: Number,
        default: 7,
      },
    },
  },

  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", schema);
