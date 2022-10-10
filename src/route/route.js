const express = require('express')

const router = express.Router()

const {createuser,userLogin, getuser} = require("../Controller/userController")

router.post("/register",createuser)

router.post("/login",userLogin)

router.get("/user/:userId/profile" ,getuser)




module.exports=router