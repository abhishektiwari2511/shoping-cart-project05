const express = require('express')

const router = express.Router()

const {createuser,userLogin, getuser, updateuser} = require("../Controller/userController")

const {createProduct, getbyquery, getbyparams, deleteProductById, updateProducts} = require("../Controller/productController");

const {createcart,getCart} = require("../Controller/cartController");

const {authentication,authorisation} = require("../auth/authentication");

//------------------------------------------user router-----------------------------------------------------------------

router.post("/register",createuser)

router.post("/login",userLogin)

router.get("/user/:userId/profile" ,authentication,authorisation, getuser)

router.put("/user/:userId/profile" ,authentication,authorisation, updateuser)

//------------------------------user routes-----------------------------------------------------------------------------

router.post("/products" ,createProduct)

router.get("/products" ,getbyquery)

router.get("/products/:productId" ,getbyparams);

router.delete("/products/:productId" ,deleteProductById)

router.put("/products/:productId" ,updateProducts)

//----------------------------------cart routes-----------------------------------------------------------------------------------

router.post("/users/:userId/cart" ,createcart)

router.get("/users/:userId/cart" ,getCart)


module.exports=router