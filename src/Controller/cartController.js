const cartModel = require("../Model/cartModel");
const mongoose = require("mongoose");
const { isValid } = require("../validator/validator");



const createcart = async function(req,res) {
    let data = req.body;
    let {items, totalPrice, totalItems} = data;

    if(Object.keys(data).length == 0) return res.status(400).send({status:false, message:"plss put some data in body"})

    if(data.hasOwnProperty("items")){
       
    }

    if(data.hasOwnProperty("totalPrice")){
       if(!isValid(totalPrice)) return res.status(400).send({status:false, message:"plss put valid totalPrice or totalPrice is required"})
        }
     
        if(data.hasOwnProperty("totalItems")){
          if(!isValid(totalItems))  return res.status(400).send({status:false, message:"plss put valid totalItems or totalItems is required"})
            }
        

    let newcart = cartModel.create(data);
}