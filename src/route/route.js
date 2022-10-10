const express = require('express')

const router = express.Router()

const userController = require("../Controller/userController")

router.post("/write-file-aws",userController.awsfile)
router.post("/login",userController.userLogin)



module.exports=router