import express from "express";
import { createServer } from "http";
import session from "express-session";
import MongoStore from "connect-mongo";
const app = express();

import { home, product, login } from "./routes/index.js";
import { socketController } from "./src/utils/socketController.js";

//IMPLEMENTACION DE IO
import { Server } from "socket.io";
const httpServer = createServer(app);
const io = new Server(httpServer, {});
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
socketController(io);

//SERVER
const PORT = process.env.port || 8080;
httpServer.listen(process.env.PORT || PORT, () =>
  console.log("Servidor Funcionando en Puerto: " + PORT)
);
httpServer.on("error", (error) => console.log(`Error en servidor ${error}`));

import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// EJS CONFIG
app.set("view engine", "ejs");
app.set("views", "./views");

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://LauraAnaliaNunez:Lau56542810.@cluster0.gaaiwmb.mongodb.net/test",
      mongoOptions: advancedOptions,
    }),
    secret: "A secret",
    cookie: { maxAge: 600000 },
    resave: false,
    saveUninitialized: false,
  })
);

// ROUTERS
app.use((req, res, next) => {
  req.session.touch();
  next();
});
app.get("/", (req, res) => {
  res.send("Welcome");
});
app.use("/api/products", product);
app.use("/login", login);
app.use("/home", home);
app.get("/logout", (req, res) => {
  let username = req.session.username;
  req.session.destroy((err) => {
    if (err) {
      return res.json({ status: "Logout ERROR", body: err });
    }
    res.render("pages/logout", { name: username });
  });
});
