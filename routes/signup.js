import { Router } from "express";
import { signupController } from "../controller/signupController.js";
import passport from "passport";

const signup = Router();

signup.get("/", signupController.get);
signup.get("/failsignup", signupController.errorSignup);

signup.post(
  "/",
  passport.authenticate("signup", { failureRedirect: "/signup/failsignup" }),
  signupController.postsignup
);

export default signup;
