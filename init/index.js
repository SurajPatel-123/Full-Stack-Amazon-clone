const mongoose=require("mongoose");
const initData=require("./data");
const Product =require("../models/product");

async function main(){
 await mongoose.connect("mongodb://127.0.0.1:27017/productDB");
console.log("connected to DB");

await Product.deleteMany({});
console.log("Final Object",initData.data[0]);

const result=await Product.insertMany(initData.data);
console.log("Inserted",result.length);

const count=await Product.countDocuments();
console.log("Final count",count);

mongoose.connection.close();
}

main().catch(err=>{
  console.log("error",err);
})