const cartModel = require("../Model/cartModel");
const mongoose = require("mongoose");
const { isValid } = require("../validator/validator");
const productModel = require("../Model/productModel");
const userModel = require("../Model/userModel");


const createcart = async function(req,res) {
  try {
    let data = req.body;
    let userId = req.params.userId
    var {cartId, productId} = data;
    let items = [];

    if(Object.keys(data).length == 0) return res.status(400).send({status:false, message:"plss put some data in body"})
     
    if(!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).send({ status: false, message: "ProductId is not in proper format" });
     
    if(userId) {
      if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "userId is not in proper format" });
    }
    const oldcart = await cartModel.findOne({userId : userId});
    const newproduct = await  productModel.findOne({productId , isDeleted : false});

    if(!oldcart) {
      if(newproduct){
      data["userId"] = userId;
      let obj = {}
          obj["productId"] = productId
          obj["quantity"] = 1
       items.push(obj);
      data["items"] = items;
      data["totalPrice"] = newproduct.price;
      data["totalItems"] = items.length;
    }else {
      return res.status(400).send({status:false, message: "Product is not exist"});
    }
  }
    if(oldcart) {
      if(newproduct ) {
        let newitems = oldcart.items;
        for(i=0;i<newitems.length;i++){
          newitems[i].quantity += 1;
          var cool = newitems[i].quantity
          var newcool = newitems[i].productId;
        }  
        if(productId == newcool){
        var newcool = {
          productId : productId,
          quantity : cool
        }
        var newlyprice = (newproduct.price) * cool;
        var newlycreatecart = await cartModel.findOneAndUpdate({productId : productId} ,{$set:{items : newcool , totalPrice : newlyprice}}, {new:true});
        return res.status(201).send({status:true, message: "Succesfully updated 1" , data: newlycreatecart});
      } 
      if(productId != newcool) {
        let obj = {}
        obj["productId"] = productId
        obj["quantity"] = 1
        items.push(obj);
        console.log(items);
        var oldercart = await cartModel.findOneAndUpdate({productId : userId} , {$push : {items : items}}, {new:true});
        return res.status(201).send({status:true, message: "Succesfully updated 2" , data: oldercart});
      } else {
        return res.status(400).send({status:false, message: "Product is not exist"});
      }
    }  
  }   
    
  } catch (err) {
    res.status(500).send({ staus: false, msg: err.message });
  }
}


let getCart = async function(req,res){
  try{
      let userId = req.params.userId
      if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({status:false,message:"please provide valid userid for details"})

      // let checkCart = await cartModel.findOne({userId:userId}).populate(items.productId)
      let checkCart = await cartModel.findOne({userId:userId}).populate("items")
      if(!checkCart){
      return res.status(400).send({status:false, message : "The Cart does not exist with this user"})
  }
  return res.status(200).send({status:true,message:checkCart})
  }
  catch(err){
    return res.status(500).send({status:false,message:err.message})
  }
}

const DeleteCart = async function (req,res) {
  
  try{
    const userId = req.params.userId
   if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({status:false,message:"your userId is invaild"})
   const cartData = await cartModel.findOne({ userId: userId })
   if (!cartData) {
       return res.status(404).send({ status: false, message: "cart not found" })
   }
   let cart ={totleItems:0,totlePrice:0,items:[]}
   const finaldata = await cartModel.findOneAndUpdate({userId:userId},cart,{new:true})
   return res.status(204).send({status:true,message:'your cart has been deleted succesfuly',data:finaldata})
}
catch(err){
   return res.status(500).send({message:err.message})
}

}

module.exports = {createcart ,getCart ,DeleteCart};