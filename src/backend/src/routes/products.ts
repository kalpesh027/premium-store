import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  deleteProduct,
  getAdminProducts,
  getAllCategories,
  getAllProducts,
  getSingleProduct,
  getlatestProducts,
  newProduct,
  updateProduct,
} from "../controllers/product.js";
import { multiUpload } from "../middlewares/multer.js";

const app = express.Router();

app.post("/new",adminOnly, multiUpload, newProduct);

app.get("/all", getAllProducts);

app.get("/latest", getlatestProducts);

app.get("/categories", getAllCategories);

app.get("/admin-products", adminOnly, getAdminProducts);

app
  .route("/:id")
  .get(getSingleProduct)
  .put(adminOnly, multiUpload, updateProduct)
  .delete(adminOnly, deleteProduct);

export default app;
