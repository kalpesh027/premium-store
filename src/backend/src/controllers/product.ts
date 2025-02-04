import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import {
  deleteFromCloudinary,
  invalidateCache,
  uploadToCloudinary,
} from "../utils/features.js";

// Revalidate on New,Update,Delete Product & on New Order
export const getlatestProducts = TryCatch(async (req, res, next) => {
  let products;

  if (myCache.has("latest-products"))
    products = JSON.parse(myCache.get("latest-products") as string);
  else {
    products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(5);
    myCache.set("latest-products", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

// Revalidate on New,Update,Delete Product & on New Order
export const getAllCategories = TryCatch(async (req, res, next) => {
  let categories;

  if (myCache.has("categories"))
    categories = JSON.parse(myCache.get("categories") as string);
  else {
    categories = await Product.distinct("category");
    myCache.set("categories", JSON.stringify(categories));
  }

  return res.status(200).json({
    success: true,
    categories,
  });
});

// Revalidate on New,Update,Delete Product & on New Order
export const getAdminProducts = TryCatch(async (req, res, next) => {
  let products;
  if (myCache.has("all-products"))
    products = JSON.parse(myCache.get("all-products") as string);
  else {
    products = await Product.find({});
    myCache.set("all-products", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

export const getSingleProduct = TryCatch(async (req, res, next) => {
  let product;
  const id = req.params.id;
  if (myCache.has(`product-${id}`))
    product = JSON.parse(myCache.get(`product-${id}`) as string);
  else {
    product = await Product.findById(id);

    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    myCache.set(`product-${id}`, JSON.stringify(product));
  }

  return res.status(200).json({
    success: true,
    product,
  });
});

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const {
      name,
      price,
      salePrice,
      stock,
      category,
      subcategory,
      variants,
      shipping,
      returnPolicy,
      description,
    } = req.body;
    const photos = req.files as Express.Multer.File[] | undefined;

    if (!photos) return next(new ErrorHandler("Please add Photo", 400));

    if (photos.length < 1)
      return next(new ErrorHandler("Please add one Photo at least", 400));

    if (photos.length > 5)
      return next(new ErrorHandler("Please add 5 Photos at max", 400));

    if (!name || !price || !stock || !category || !description) {
      return next(new ErrorHandler("Please enter All Required Fields", 400));
    }

    // Upload Images to Cloudinary
    const PhotosUrl = await uploadToCloudinary(photos);

    await Product.create({
      name,
      price,
      salePrice,
      stock,
      category: category.toLowerCase(),
      subcategory: subcategory?.map((sub) => sub.toLowerCase()),
      variants,
      shipping,
      returnPolicy,
      description,
      photos: PhotosUrl,
    });

    invalidateCache({ product: true, admin: true });

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
    });
  }
);

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    price,
    salePrice,
    stock,
    category,
    subcategory,
    variants,
    shipping,
    returnPolicy,
    description,
  } = req.body;
  const photos = req.files as Express.Multer.File[] | undefined;
  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  if (photos) {
    const photosUrl = await uploadToCloudinary(photos);
    const ids = product.photos.map((photo) => photo.public_id);
    await deleteFromCloudinary(ids);
    product.photos = photosUrl;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (salePrice) product.salePrice = salePrice;
  if (stock) product.stock = stock;
  if (category) product.category = category.toLowerCase();
  if (subcategory) product.subcategory = subcategory.map((sub : string) => sub.toLowerCase());
  if (variants) product.variants = variants;
  if (shipping) product.shipping = shipping;
  if (returnPolicy) product.returnPolicy = returnPolicy;
  if (description) product.description = description;

  await product.save();

  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  return res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
  });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  const ids = product.photos.map((i) => i.public_id);

  await deleteFromCloudinary(ids);

  await product.deleteOne();

  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  return res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, subcategory, price} = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };

    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };

    if (category) baseQuery.category = category.toLowerCase();
    if (subcategory)
      baseQuery.subcategory = {
        $in: [subcategory.toLowerCase()],
      };

    const productsPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filteredOnlyProduct] = await Promise.all([
      productsPromise,
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  }
);
