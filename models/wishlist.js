const mongoose=require("mongoose");
const product = require("./product");

const wishlistSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
});


module.exports=mongoose.model("Wishlist",wishlistSchema);
