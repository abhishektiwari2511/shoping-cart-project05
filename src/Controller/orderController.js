const productModel = require("../Model/productModel")
const cartModel = require("../Model/cartModel")
const orderModel = require("../Model/orderModel")
const { mongo, default: mongoose } = require("mongoose")
const { isValid,isvalidStatus } = require("../validator/validator")
const userModel = require("../Model/userModel")

const createOrder  = async function(req,res){
    let cartId = req.body.cartId;
    let cancellable = req.body.cancellable;

    if(Object.keys(req.body).length == 0) return res.status(400).send({status:false ,message:"plss put some data in body"});
    if(!mongoose.Types.ObjectId.isValid(cartId) || !isValid(cartId)) return res.status(400).send({status:false ,message:`plss put valid ${cartId}`});

    let userId = req.params.userId
    if(!mongoose.Types.ObjectId.isValid(userId) || !isValid(userId)) return res.status(400).send({status:false ,message:`plss put valid ${userId}`});

    let userCart = await cartModel.findOne({_id:cartId})
    let array = userCart.items
    let totalQuantity = 0
    for(let i=0;i<array.length;i++){
        totalQuantity+=array[i].quantity 
    }
    console.log(totalQuantity)
    let obj ={userId:userCart.userId,
    items:userCart.items,
    totalPrice:userCart.totalPrice,
    totalItems:userCart.totalItems,
    totalQuantity:totalQuantity,
    cancellable:cancellable,
    status:"pending"
    
}
let orderCreate = await orderModel.create(obj)

let cart ={totalItems:0,totalPrice:0,items:[]}
const finaldata = await cartModel.findOneAndUpdate({_id:cartId},cart,{new:true})
    

return res.status(201).send({status:true, message:"Success",data:orderCreate})
}

const updateOrder = async function(req,res) {
    try {
    let userId = req.params.userId;
    let data = req.body;
    if(Object.keys(data).length == 0) return res.status(400).send({status:false, message:"pls put some data in body"});
      let {orderId , status} = data;
      
      if(!mongoose.Types.ObjectId.isValid(orderId) || !isValid(orderId)) return res.status(400).send({status:false, message:"pls put valid orderId"});

      if(!isValid(status) || !isvalidStatus(status)) return res.status(400).send({status:false, message:"pls put valid status or status is required"});
         let newlyuser = await userModel.findById(userId);
         if(!newlyuser) return res.status(400).send({status:false, message:"user is not exist"});
         
         let userCart = await orderModel.findOne({_id:orderId})

         if(!userCart || userCart.isDeleted == true) return res.status(400).send({status:false, message:"order is deleted or not exist"});
        
         if(!(orderId == userCart._id && userId == userCart.userId)) return res.status(400).send({status:false, message:"this order is not belongs to the user"});
          
         if(userCart.cancellable == true ) {
            let obj = { status : status};
         let updateneworder = await orderModel.findOneAndUpdate({_id : orderId} ,obj ,{new:true});
         return res.status(200).send({status:true ,message:"Success" ,data:updateneworder});
         }

        else{
            return res.status(400).send({status:false, message:"you cannot cancelled this order"});
        }
    } catch (err) {
        return res.status(500).send({ message: err.message })
      }    
}

module.exports = {createOrder ,updateOrder}