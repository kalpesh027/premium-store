import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  _id: string;
  dob: Date;
}

export interface NewProductRequestBody {
  name: string;
  description: string;
  category: string;
  subcategory?: string[];
  price: number;
  salePrice?: number;
  stock: number;
  variants?: Variant[];
  shipping?: Shipping;
  returnPolicy?: ReturnPolicy;
}

// Supporting types for NewProductRequestBody
export interface Variant {
  color: {
    name: string;
    code: string;
  };
  sizes: {
    size: "XS" | "S" | "M" | "L" | "XL";
    stock: number;
  }[];
}

export interface Shipping {
  freeShipping: boolean;
  deliveryTime?: string;
}

export interface ReturnPolicy {
  allowed: boolean;
  daysLimit: number; 
}

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;


export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string; 
  subcategory?: string;
  sort?: string;
  page?: string;
};

export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: { $lte: number };
  category?: string;
  subcategory?: {
    $in: string[]; 
  };
}

export type InvalidateCacheProps = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  userId?: string;
  orderId?: string;
  productId?: string | string[];
};

export type OrderItemType = {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string;
};

export type ShippingInfoType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
};

export interface NewOrderRequestBody {
  shippingInfo: ShippingInfoType;
  user: string;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderItems: OrderItemType[];
}
