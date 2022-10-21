import { Router } from "express";
import { loginController } from "../controller/loginController.js";

const login = Router();

login.get("/", loginController.get);
login.post("/", loginController.postLogin);

export default login;
