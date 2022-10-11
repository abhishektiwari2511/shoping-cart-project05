const jwt = require("jsonwebtoken")
const userModel = require("../Model/userModel")

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["authorization"];

        if (!token) return res.status(400).send({ status: false, msg: "token is required" })

       token = token.split(" ")
        let decodedtoken = jwt.verify(token[1],process.env.SECRET_TOKEN, (error, decodedtoken) => {
           
        if (error)  return res.status(401).send({ status: false, message: "token is invalid or expired" });

        req.loggedInUser=decodedtoken.userId;
        next()
    })
    }
    catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}


const authorisation = async function (req, res, next) {
    try {
       

        let updateuserId = req.params.userId
        

            let updatinguserId = await userModel.findById({ _id: updateuserId })
            if(!updatinguserId){ return res.status(404).send({status:false,msg:"No user details found with this id"})}
            let userId = updatinguserId._id

           
            let id = req.loggedInUser
            if (id != userId) return res.status(403).send({ status: false, msg: "You are not authorised to perform this task" })
       
        next();
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ msg: error.message })
    }
}



module.exports = { authentication , authorisation }