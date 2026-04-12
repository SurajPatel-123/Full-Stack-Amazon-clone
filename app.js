const express = require("express");
const app = express();
const path = require("path");
const initData = require("./init/data");
const products = initData.data;
const data=require("./init/data")
const Product=require("./models/product")
const User = require("./models/user");
const flash = require("connect-flash");
const userRoutes = require("./routes/user");
const passport = require("passport");
const session = require("express-session");
const engine = require("ejs-mate");
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const cartRoutes=require("./routes/cart");
const Cart =require("./models/cart")
const wishlistRoutes = require("./routes/wishlist");
const Wishlist=require("./models/wishlist");
const buyRoutes = require("./routes/buy");
const productRoutes = require("./routes/product");
// ================= VIEW ENGINE =================
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ================= MIDDLEWARE =================
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// ================= DB CONNECTION =================
mongoose.connect("mongodb://127.0.0.1:27017/productDB")
.then(() => console.log("DB Connected ✅"))
.catch((err) => console.log("DB Error ❌", err));

// ================= SESSION =================
app.use(session({
  secret: "mysupersecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: "mongodb://127.0.0.1:27017/productDB"
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// ================= PASSPORT =================
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// ✅ CORRECT (passport-local-mongoose)
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================= GLOBAL VARIABLES =================
app.use((req, res, next) => {
  res.locals.curruser = req.user;   // 👈 navbar toggle
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(async (req, res, next) => {
  try {
    const cart = await Cart.findOne();

    let count = 0;

    if (cart) {
      cart.products.forEach(item => {
        count += item.quantity;
      });
    }

    res.locals.cartCount = count;  // ✅ navbar ke liye
    next();
  } catch (err) {
    console.log(err);
    res.locals.cartCount = 0;
    next();
  }
});
app.use(async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne();

    let count = 0;

    if (wishlist) {
      wishlist.products.forEach(item => {
        count += item.quantity;
      });
    }

    res.locals.wishlistCount = count;  // ✅ navbar ke liye
    next();
  } catch (err) {
    console.log(err);
    res.locals.wishlistCount = 0;
    next();
  }
});

app.get("/order-confirm", (req, res) => {
    res.render("order-confirm");
});
let orders=[];
app.get("/orders", (req, res) => {
    res.render("orders", { orders });
});
app.use(express.json()); // 🔥 ye missing hai tumhare code me

app.post("/place-order", (req, res) => {
    const order = req.body;

    orders.push(order);   // ✅ yahan save hoga

    console.log("New Order:", order); // debug

    res.redirect("/order-confirm");
});
// ================= ROUTES =================
app.use("/", userRoutes);
app.use("/cart", cartRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/buy", buyRoutes);
app.use("/",productRoutes);
// Home route
app.get("/products", (req, res) => {
  res.render("products/index.ejs",{showContainer2:req.path});
});
app.get("/clearCart", async (req, res) => {
  await Cart.deleteMany({});
  res.send("Cart Cleared ✅");
});
app.get("/init", async (req, res) => {
  await Product.deleteMany({});
  await Product.insertMany(require("./init/data").data);
  res.send("Data Initialized ✅");
});
// Kitchen page
app.get("/kitchen", async (req, res) => {
  const kitchen = await Product.find({ category: "kitchen" });
  res.render("productpages/Kitchen.ejs", { kitchen,showContainer2:false });
});

// Electronics page
app.get("/electronics", async (req, res) => {
  const ElectronicsProducts = await Product.find({ category: "electronics" });
  res.render("productpages/electronics.ejs", { ElectronicsProducts ,showContainer2:false});
});

// Toys page
app.get("/toys", async (req, res) => {
  const toys = await Product.find({ category: "toys" });
  res.render("productpages/toys.ejs", { toys,showContainer2:false });
});

// Mobile page
app.get("/mobile", async (req, res) => {
  const mobile = await Product.find({ category: "mobile" });
  res.render("productpages/mobile.ejs", { mobile ,showContainer2:false});
});

// Fashion page
app.get("/fashion", async (req, res) => {
  const fashion= await Product.find({ category: "fashion" });
  res.render("productpages/fashion.ejs", {fashion,showContainer2:false });
});


// Sports page
app.get("/sport", async (req, res) => {
  const sports = await Product.find({ category: "sports" });
  res.render("productpages/sports.ejs", { sports,showContainer2:false });
});

// Books page
app.get("/books", async (req, res) => {
  const books = await Product.find({ category: "books" });
  res.render("productpages/book.ejs", { books,showContainer2:false });
});
// Beauty page
app.get("/beauty", async (req, res) => {
  const beauty = await Product.find({ category: "beauty" });
  console.log("Beauty:", beauty); // 👈 check karo
  res.render("productpages/beauty.ejs", { beauty,showContainer2:false });
});
// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server running on port 3000 🚀");
});
