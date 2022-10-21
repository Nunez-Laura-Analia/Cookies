import { fileURLToPath } from "url";
import { dirname } from "path";
import { createServer } from "http";
import express from "express";
import session from "express-session";
import { Server } from "socket.io";
import { socketController } from "./src/utils/socketController.js";
import { home, product, login, signup, logout } from "./routes/index.js";

//VARIABLES DE ENTORNO
import { PORT, MONGOPSW } from "./config.js";

//Login
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import redis from "redis";
import connectRedis from "connect-redis";
import mongoose from "mongoose";
import Usuarios from "./models/usuarioSchema.js";
import { isValidPassword, createHash } from "./src/utils/passwordsFunctions.js";

//SOCKETS
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//DATA BASE
mongoose
  .connect(
    `mongodb+srv://LauraAnaliaNunez:${MONGOPSW}.@cluster0.gaaiwmb.mongodb.net/test`,
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected to Mongo Atlas"));

//CONFIG PASSPORT
passport.use(
  "login",
  new LocalStrategy((username, password, done) => {
    Usuarios.findOne({ username: username }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        console.log("User not found with username " + username);
        return done(null, false);
        //null significa sin error, y false parametro a enviar
      }
      if (!isValidPassword(user, password)) {
        console.log("Invalid Password");
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

passport.use(
  "signup",
  new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
      Usuarios.findOne({ username: username }, function (error, user) {
        if (error) {
          console.log("Error in SingnUp: " + error);
          return done(error);
        }
        if (user) {
          console.log("User already exists");
          return done(null, false);
        }
        const newUser = {
          username: username,
          password: createHash(password),
        };
        Usuarios.create(newUser, (err, user) => {
          if (err) {
            console.log("Error in Saving user: " + err);
            return done(err);
          }
          console.log("User Registration succesful");
          return done(null, user);
        });
      });
    }
  )
);

//PASSPORT MIDDLEWARES
passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((id, done) => {
  Usuarios.findById(id, done);
});

//REDIS
const client = redis.createClient({ legacyMode: true });
client.connect();
const RedisStore = connectRedis(session);

app.use(
  session({
    store: new RedisStore({ host: "localhost", port: 6379, client, ttl: 300 }),
    secret: "keyboard cat",
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 86400000, // 1 dia
    },
    rolling: true,
    resave: true,
    saveUninitialized: false,
  })
);

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  req.session.touch();
  next();
});

// ROUTES
app.get("/", (req, res) => {
  res.redirect("/login");
});
app.use("/api/products-test", product);
app.use("/login", login);
app.use("/signup", signup);
app.use("/home", home);
app.use("/logout", logout);

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

app.get("/ruta-protegida", checkAuthentication, (req, res) => {
  const { username, password } = req.user;
  const user = { username, password };
  res.send("<h1>Ruta ok!</h1>" + JSON.stringify(user));
});

//SERVER
httpServer.listen(PORT, () =>
  console.log("Servidor Funcionando en Puerto: " + PORT)
);
httpServer.on("error", (error) => console.log(`Error en servidor ${error}`));

//SOCKET
socketController(io);

//REQUEST ERROR
app.all("*", (req, res) => {
  res.status(404).send("Ruta no encontrada");
});
