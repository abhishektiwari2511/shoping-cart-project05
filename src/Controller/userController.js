const userModel = require("../Model/userModel")
const aws= require("aws-sdk")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const validator = require("../validator/validator")

const isValidreqbody = function (body) {
    return Object.keys(body).length > 0
}


aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKeyId: process.env.AWS_SECRET_ACCESS_KEY,
    region: "ap-south-1"
})

let uploadFile= async ( file) =>{
   return new Promise( function(resolve, reject) {
    // this function will upload file to aws and return the link
    let s3= new aws.S3({apiVersion: '2006-03-01'}); 

    var uploadParams= {
        ACL: "public-read",
        Bucket: "classroom-training-bucket", 
        Key: "abc/" + file.originalname, 
        Body: file.buffer
    }


    s3.upload( uploadParams, function (err, data ){
        if(err) {
            return reject({"error": err.message})
        }
        console.log("file uploaded succesfully")
        return resolve(data.Location)
    })

   

   })
}


     const awsfile = async function(req, res) {
    try{
        let files= req.files
        let body = req.body;

        let {fname, lname, email, phone, password, adress} = body;

           //applying bcrypt
           const hashPassword = await bcrypt.hash(password, 10);
           req.body.password = hashPassword;

        if(files && files.length>0){
            // res.send the link back to frontend/postman
            let uploadedFileURL= await uploadFile( files[0] )

           

            let obj = {
                fname : fname,
                lname : lname,
                email : email,
                phone : phone,
                profileImage : uploadedFileURL,
                password : hashPassword,

            }

          let usercreate = await userModel.create(obj);

            return res.status(201).send({msg: "file uploaded succesfully", data: usercreate})
        }
        else{
            return res.status(400).send({ msg: "No file found" })
        }
        
    }
    catch(err){
        return res.status(500).send({msg: err})
    }
    
}



const userLogin = async function(req,res){
    try{
        let data = req.body;
        if (!isValidreqbody(data)) {
            return res.status(400).send({ statua: false, message: "Please provide login details!!" })
        }

        const { email, password } = data

        if (!(email)) {
            return res.status(400).send({ status: false, message: "Email is required!!" })
        }
        if (!(password)) {
            return res.status(400).send({ status: false, message: "Password is required!!" })
        }

        // check email for user
        // let user = await userModel.findOne({ email: email,password:password});
        

        // check password of existing user
       

        let userid = await userModel.findOne({ email: email, password: password })
        if (!userid) return res.status(400).send({ status: false, message: "Email or password is not correct, Please provide valid email or password" });

        
        // using jwt for creating token
        let token = jwt.sign(
            {
                userId: userid._id.toString(),
                exp: Math.floor(Date.now() / 1000) + (60 * 360)
            },
            "Project5-Group56"
        );

        res.status(200).send({ status: true, message: "Success", data: token });
    }
    catch(err){
        res.status(500).send({ status: false, Error: err.message });
    }
}


module.exports = {userLogin,awsfile}