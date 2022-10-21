import { Router } from "express";

const logout = Router();

logout.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    const name = req.session.username;
    req.logout((error) => {
      if (error) {
        res.json(error);
      }
      res.render("pages/logout", { name: name });
    });
  } else {
    res.redirect("/login");
  }
});

export default logout;
