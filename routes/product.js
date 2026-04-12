const express=require("express");
const router=express.Router();

router.get("/search", async (req, res) => {
  const { q, category } = req.query;

  const Product = require("../models/product");

  let filter = {
    title: { $regex: q, $options: "i" }
  };

  if (category && category !== "all") {
    filter.category = category;
  }

  const products = await Product.find(filter);

  res.render("search", { products, q,showContainer2:false });
});
module.exports=router;