// ================= BASIC SETUP =================
const express = require("express");
const app = express();
const path = require("path");

// ================= ENV =================
require("dotenv").config();

// ================= MODELS =================
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const Wishlist = require("./models/wishlist");

// ================= ROUTES =================
const userRoutes = require("./routes/user");
const cartRoutes = require("./routes/cart");
const wishlistRoutes = require("./routes/wishlist");
const buyRoutes = require("./routes/buy");
const productRoutes = require("./routes/product");

// ================= OTHER PACKAGES =================
const flash = require("connect-flash");
const passport = require("passport");
const session = require("express-session");
const engine = require("ejs-mate");
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

// ================= VIEW ENGINE =================
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ================= MIDDLEWARE =================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ================= DB CONNECTION (ATLAS FIXED) =================
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB Connected ✅"))
.catch((err) => console.log("DB Error ❌", err));

// ================= SESSION (ATLAS FIXED) =================
app.use(session({
  secret: "mysupersecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// ================= PASSPORT =================
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================= GLOBAL VARIABLES =================
app.use((req, res, next) => {
  res.locals.curruser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ================= CART COUNT =================
app.use(async (req, res, next) => {
  try {
    const cart = await Cart.findOne();
    let count = 0;

    if (cart) {
      cart.products.forEach(item => {
        count += item.quantity;
      });
    }

    res.locals.cartCount = count;
    next();
  } catch (err) {
    console.log(err);
    res.locals.cartCount = 0;
    next();
  }
});

// ================= WISHLIST COUNT =================
app.use(async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne();
    let count = 0;

    if (wishlist) {
      wishlist.products.forEach(item => {
        count += item.quantity;
      });
    }

    res.locals.wishlistCount = count;
    next();
  } catch (err) {
    console.log(err);
    res.locals.wishlistCount = 0;
    next();
  }
});

// ================= ORDERS =================
let orders = [];

app.get("/order-confirm", (req, res) => {
  res.render("order-confirm");
});

app.get("/orders", (req, res) => {
  res.render("orders", { orders });
});

app.post("/place-order", (req, res) => {
  const order = req.body;
  orders.push(order);
  console.log("New Order:", order);
  res.redirect("/order-confirm");
});

// ================= ROUTES =================
app.use("/", userRoutes);
app.use("/cart", cartRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/buy", buyRoutes);
app.use("/products", productRoutes);

// ================= HOME =================
app.get("/", (req, res) => {
  res.render("products/index", { showContainer2: req.path });
});

// ================= INIT DATA =================
app.get("/init", async (req, res) => {
  await Product.deleteMany({});
  await Product.insertMany(require("./init/data").data);
  res.send("Data Initialized ✅");
});

// ================= CATEGORY ROUTES =================
app.get("/kitchen", async (req, res) => {
  const kitchen = await Product.find({ category: "kitchen" });
  res.render("productpages/Kitchen", { kitchen, showContainer2: false });
});

app.get("/electronics", async (req, res) => {
  const ElectronicsProducts = await Product.find({ category: "electronics" });
  res.render("productpages/electronics", { ElectronicsProducts, showContainer2: false });
});

app.get("/toys", async (req, res) => {
  const toys = await Product.find({ category: "toys" });
  res.render("productpages/toys", { toys, showContainer2: false });
});

app.get("/mobile", async (req, res) => {
  const mobile = await Product.find({ category: "mobile" });
  res.render("productpages/mobile", { mobile, showContainer2: false });
});

app.get("/fashion", async (req, res) => {
  const fashion = await Product.find({ category: "fashion" });
  res.render("productpages/fashion", { fashion, showContainer2: false });
});

app.get("/sport", async (req, res) => {
  const sports = await Product.find({ category: "sports" });
  res.render("productpages/sports", { sports, showContainer2: false });
});

app.get("/books", async (req, res) => {
  const books = await Product.find({ category: "books" });
  res.render("productpages/book", { books, showContainer2: false });
});

app.get("/beauty", async (req, res) => {
  const beauty = await Product.find({ category: "beauty" });
  res.render("productpages/beauty", { beauty, showContainer2: false });
});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});