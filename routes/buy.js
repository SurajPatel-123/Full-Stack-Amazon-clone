const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// POST route (form ke liye)
router.post("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.send("Product not found ❌");
  }

  res.render("buy", { product });
});

module.exports = router;