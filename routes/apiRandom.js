import { Router } from "express";
import { apiRandomController } from "../controller/apiRandomController.js";
const apiRandom = Router();

apiRandom.get("/", apiRandomController.get);

apiRandom.post("/", apiRandomController.post);

export default apiRandom;
