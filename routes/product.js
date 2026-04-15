const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// SEARCH
router.get("/search", async (req, res) => {
  const { q, category } = req.query;

  let filter = {
    title: { $regex: q, $options: "i" }
  };

  if (category && category !== "all") {
    filter.category = category;
  }

  const products = await Product.find(filter);

  res.render("search", { products, q, showContainer2: false });
});

// 🔥 PRODUCT DETAILS PAGE (ADD THIS)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("products/show", { product });
  } catch (err) {
    console.log(err);
    res.send("Product not found");
  }
});

module.exports = router;