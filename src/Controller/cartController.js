const cartModel = require("../Model/cartModel");
const mongoose = require("mongoose");
const { isValid } = require("../validator/validator");
const productModel = require("../Model/productModel");
const userModel = require("../Model/userModel");



  const createCart = async function (req, res) {
    try {
      let userId = req.params.userId;
      let data = req.body;
      let { productId, quantity, cartId } = data;
  
      if (Object.keys(data).length == 0) return res.status(400).send({status: false,message: "Please provide data in request body"});
    
  
   if (!mongoose.Types.ObjectId.isValid(userId))  return res.status(400).send({ status: false, message: "Please provide valid User Id" });
  
      let findUser = await userModel.findById(userId);
      if (!findUser) return res.status(404).send({ status: false, message: `user doesn't exist ${userId}` });
  
      if (!productId) return res.status(400).send({ status: false, message: "productId is required" });
      
  
      if (!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).send({ status: false, message: "Please provide valid productId" });
  
      let findProduct = await productModel.findOne({_id: productId,isDeleted: false});

      if (!findProduct) return res.status(404).send({ status: false, message: `product doesn't exist ${productId}` });
  
      if (!quantity) quantity = 1;
  
      let findCart = await cartModel.findOne({ userId });

      if (!findCart) {
        let cartData = {
          userId,
          items: [{ productId: productId, quantity: quantity }],
          totalPrice: (findProduct.price * quantity), //.toFixed(2),
          totalItems: 1,
        };
  
        let newlyCart = await cartModel.create(cartData);
        return res.status(201).send({status: true,message: "cart created successfully",data: newlyCart});
      }
  
      if (findCart) {

        if(!cartId) return res.status(400).send({status: false,message: "cartId must be present"});
        if(!mongoose.Types.ObjectId.isValid(cartId)) return res.status(400).send({status: false,message: "cartId must be valid"});
        let price = findCart.totalPrice + quantity * findProduct.price;
  
        let cartloon = findCart.items;
  
        for (let i = 0; i < cartloon.length; i++) {
          if (cartloon[i].productId.toString() === productId) {
            cartloon[i].quantity += quantity; 
            
            let updatedCart = {items: cartloon,totalPrice: price,totalItems: cartloon.length};
  
      let updatedata = await cartModel.findOneAndUpdate({ _id: cartId, "items.productId":productId }, updatedCart, { new: true });
  
      return res.status(200).send({status: true,message: "Product added successfully",data: updatedata});
          }
        }
  
        cartloon.push({ productId: productId, quantity: quantity });
        let updatedCart = {items: cartloon, totalPrice: price, totalItems: cartloon.length};
  
    let updatedata = await cartModel.findOneAndUpdate({ _id: cartId }, updatedCart, { new: true });
  
        return res.status(200).send({status: true,message: "Product added successfully",data: updatedata});
      }
    } catch (err) {
      res.status(500).send({ staus: false, message: err.message });
    }
  };

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

const updateCart = async function (req, res) {
  try {
      let userId = req.params.userId

      let { cartId, productId, removeProduct } = req.body

      if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "enter a valid user id" })

      let findUser = await cartModel.findOne({ cartId: cartId, userId: userId })

      if (!findUser) return res.status(404).send({ status: false, message: "cart of this user does not exist" })

      //Authorization Check
      if (findUser.userId != req.token.userId) return res.status(403).send({ status: false, message: "Unauthorized User" })

      if (!isValidRequestBody(req.body)) return res.status(400).send({ status: false, message: "body cannot be empty" })

      if (!isPresent(cartId) || !isPresent(productId) || !isPresent(removeProduct)) return res.status(400).send({ status: false, message: "Required : cartId ,productId ,removeProduct" })

      if (!isValidObjectId(cartId) || !isValidObjectId(productId)) return res.status(400).send({ status: false, message: "enter valid IDs" })

      if (!([0, 1]).includes(removeProduct)) return res.status(400).send({ status: false, message: "removeProduct must contain 0 or 1" })
      

      let findCart = await cartModel.findById({ _id: cartId })

      if (!findCart) return res.status(404).send({ status: false, message: "Cart Not Found" })
l
      let arr = []

      //using for loop saved the product ids in arr
      //toString() : .includes works for a string only
      for (let i = 0; i < findCart.items.length; i++) {

          arr.push(findCart.items[i].productId.toString())
      }

      //console.log(arr)
      if (!arr.includes(productId)) return res.status(404).send({ status: false, message: "product does not exist" })

      //if product found , access quantity 
      //[0] : want the one only 
      let quantity = findCart.items.filter(x => x.productId.toString() === productId)[0].quantity

      let product = await productModel.findById(productId)

      //if removeProduct == 1
      if (removeProduct == 1) {
          if (quantity > 1) {

              let updateCart = await cartModel.findOneAndUpdate(
                  { _id: cartId, "items.productId": productId },
                  {
                      $inc: {
                          "items.$.quantity": -1,
                          totalPrice: - product.price

                      }
                  },
                  { new: true }

              )
              return res.status(200).send({ status: true, message: "updated successfully", data: updateCart })
          } else {
              //while decreasing the quantity  becomes 0 delete it
              let deleteProduct = await cartModel.findOneAndUpdate(
                  { 'items.productId': productId, userId: userId },
                  { $pull: { items: { productId } }, $inc: { totalItems: -1, totalPrice: -product.price } },
                  { new: true }

              )
              return res.status(200).send({ status: true, message: "updated sucessfully", data: deleteProduct })
          }
      }

      //if removeProduct == 0
      if (removeProduct == 0) {

          let productQuantity = findCart.items

          let speciPro;

          for (i of productQuantity) {
              speciPro = i
              console.log("here", i)
          }
          let obj = { product: product._id, quantity: speciPro.quantity }

          let updateCart = await cartModel.findOneAndUpdate(
              { _id: cartId, "items.productId": productId },
              {
                  //$unset:{"items.$.productId":1,"items.$.quantity":1,"items.$._id":1}only removes a field, doesn't delete
                  //$pull : deletes a specified object from an array
                  $pull: { items: { productId } },
                  $inc: { totalPrice: - product.price * obj.quantity, totalItems: -1 }
              },
              { new: true }
          )
          return res.status(200).send({ status: true, message: "updated successfully", data: updateCart })
      }


  } catch (error) {
      return res.status(500).send({ status: false, message: error.message })
  }
}

module.exports = {createCart ,getCart ,DeleteCart};