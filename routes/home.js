import { Router } from "express";
const home = Router();
import { loginController } from "../controller/loginController.js";

home.get("/", loginController.auth, (req, res, next) => {
  res.render("pages/home", { name: req.session.username });
});

export default home;