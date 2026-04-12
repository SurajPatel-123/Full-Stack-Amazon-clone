const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const Product = require("../models/product");
const data = require("../init/data");
const {isLoggedIn}=require("../middleware");
router.post("/add/:id",isLoggedIn, async (req, res) => {
  const productId = req.params.id;

  let cart = await Cart.findOne();
  if (!cart) cart = new Cart({ products: [] });

  // 🔥 check if already exists
  const existing = cart.products.find(
    item => item.productId.toString() === productId
  );

  if (existing) {
    existing.quantity += 1;   // ✅ increase count
  } else {
    cart.products.push({
      productId: productId,
      quantity: 1
    });
  }

  await cart.save();
  req.flash("success","Your product is added in Cart");

  res.redirect("/products");
});
 
router.get("/", async (req, res) => {
  const cart = await Cart.findOne().populate("products.productId");

  let total = 0;

  if (cart) {
    cart.products.forEach(item => {
      total += item.productId.price * item.quantity;
    });
  }

  res.render("cart", { cart, total,showContainer2:false });
});

// 🔴 Remove item
router.post("/remove/:id",async (req, res) => {
  const id = req.params.id;

  const cart = await Cart.findOne();

  // remove item from array
  cart.products = cart.products.filter(
    item => item._id.toString() !== id
  );

  await cart.save();

  res.redirect("/cart");
});

module.exports = router;