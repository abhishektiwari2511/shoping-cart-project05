const express = require('express')

const router = express.Router()

const {createuser,userLogin, getuser, updateuser} = require("../Controller/userController")

const {createProduct, getbyquery, getbyparams, deleteProductById, updateProducts} = require("../Controller/productController");

const {authentication,authorisation} = require("../auth/authentication");

router.post("/register",createuser)

router.post("/login",userLogin)

router.get("/user/:userId/profile" ,authentication, getuser)

router.put("/user/:userId/profile" ,authentication,authorisation, updateuser)

router.post("/products" ,createProduct)

router.get("/products" ,getbyquery)

router.get("/products/:productId" ,getbyparams);

router.delete("/products/:productId" ,deleteProductById)

router.put("/products/:productId" ,updateProducts)

module.exports=router