const express = require('express')

const router = express.Router()

const {createuser,userLogin, getuser, updateuser} = require("../Controller/userController")

const {authentication,authorisation} = require("../auth/authentication");
router.post("/register",createuser)

router.post("/login",userLogin)

router.get("/user/:userId/profile" ,authentication, getuser)

router.put("/user/:userId/profile" ,authentication,authorisation, updateuser)


module.exports=router