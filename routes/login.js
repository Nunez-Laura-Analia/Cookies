import { Router } from "express";
const login = Router();
import { loginController } from "../controller/loginController.js";

login.get("/", loginController.get);
login.post("/", loginController.postLogin);

export default login;
