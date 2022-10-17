import { Router } from "express";
import { productController } from "../controller/productController.js";

const product = Router();
product.get("/", productController.getData);

export default product;