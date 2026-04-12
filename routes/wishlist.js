const express = require("express");
const router = express.Router();
const Wishlist = require("../models/wishlist");
const Product = require("../models/product");

const {isLoggedIn}=require("../middleware");
router.post("/add/:id",isLoggedIn, async (req, res) => {
  const productId = req.params.id;

  let wishlist = await Wishlist.findOne();
  if (!wishlist) cart = new Wishlist({ products: [] });

  // 🔥 check if already exists
  const existing = wishlist.products.find(
    item => item.productId.toString() === productId
  );

  if (existing) {
    existing.quantity += 1;   // ✅ increase count
  } else {
    wishlist.products.push({
      productId: productId,
      quantity: 1
    });
  }

  await wishlist.save();
req.flash("success","Your Product is added in wishlist");
  res.redirect("/products");
});
 
router.get("/", async (req, res) => {
  const wishlist = await Wishlist.findOne().populate("products.productId");

  let total = 0;

  if (wishlist) {
    wishlist.products.forEach(item => {
      total += item.productId.price * item.quantity;
    });
  }
  res.render("wishlist", { wishlist, total,showContainer2:false });
});
// 🔴 Remove item
router.post("/remove/:id",async (req, res) => {
  const id = req.params.id;

  const wishlist = await Wishlist.findOne();

  // remove item from array
  wishlist.products = wishlist.products.filter(
    item => item._id.toString() !== id
  );

  await wishlist.save();
req.flash("error","Product is remove in wishlist");
  res.redirect("/products");
});
module.exports=router;