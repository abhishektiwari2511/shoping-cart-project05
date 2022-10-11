const userModel = require("../Model/userModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const {isValid,isValidPincode,isValidEmail,isValidPassword,isValidName,isValidNumber } = require("../validator/validator")
const {uploadFile} = require("../aws/awscontroller");
const { default: mongoose } = require("mongoose");

// -----------------------------------create user api-------------------------------------------------------------------------
     const createuser = async function(req, res) {
    try{
        let files= req.files
        let body = req.body;

        let {fname, lname, email, phone, password, address} = body;

        if(Object.keys(body).length == 0) return res.status(400).send({ status: false, message: "plss put some data in body" })

        if (!isValid(fname)) return res.status(400).send({ status: false, message: "first name is required!!" })
        
        if (!isValidName(fname))  return res.status(400).send({ status: false, message: "input valid firstname" })

        if (!isValid(lname))  return res.status(400).send({ status: false, message: "last name is required!!" })

        if (!isValidName(lname))   return res.status(400).send({ status: false, message: "input valid lastname" })

        if (!isValid(email))  return res.status(400).send({ status: false, message: "Email is required!!" })

        const newemail = await userModel.findOne({email});
        if(newemail) return res.status(400).send({ status: false, message: "Email is already present" })

        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "Email is invalid" })

        if (!isValid(phone)) return res.status(400).send({ status: false, message: "ph number is required!!" })
        
        const newphone = await userModel.findOne({phone});
        if(newphone) return res.status(400).send({ status: false, message: "phone number is already present" })

        if (!isValidNumber(phone))  return res.status(400).send({ status: false, message: "ph number must be starting from 6 and it contains 10 digits" })
        
        if (!isValid(password))  return res.status(400).send({ status: false, message: "Password is required!!" })
        
        if (!isValidPassword(password)) { return res.status(400).send({ status: false, message: "Password must be contain of 8 to 15 character with special charcter and one lowercase ,one uppercase and numbers" })
    }
        

           //applying bcrypt
           const hashPassword = await bcrypt.hash(password, 10);
           req.body.password = hashPassword;
         
        //    adress validation

         if (!isValid(address.shipping.street)) return res.status(400).send({ status: false, message: "Invalid shipping street or shipping street is required" })

         if (!isValid(address.shipping.city)) return res.status(400).send({ status: false, message: "Invalid shipping city or Shipping City is required" });

         if (!isValidPincode(address.shipping.pincode)) return res.status(400).send({ status: false, message: "Invalid shipping pincode or Shipping Pincode is required" });

         if (!isValid(address.billing.street)) return res.status(400).send({ status: false, message: "Invalid billing street or Billing Street is required" });

         if (!isValid(address.billing.city)) return res.status(400).send({ status: false, message: "Invalid billing city or Billing City is required" });

         if (!isValidPincode(address.billing.pincode)) return res.status(400).send({ status: false, message: "Invalid billing pincode or Billing Pincode is required" });
         

        if(files && files.length>0) {
            // res.send the link back to frontend/postman
            let uploadedFileURL= await uploadFile( files[0] )
            body.profileImage = uploadedFileURL
        }
        else{
            return res.status(400).send({ message: "No file found" })
        }
        let usercreate = await userModel.create(body);
        return res.status(201).send({status : true, message: "user create succesfully", data: usercreate})
        
    }
    catch(err){
        return res.status(500).send({message: err.message})
    }
    
}

// --------------------------------------login api----------------------------------------------------------------------
const userLogin = async function(req,res){
    try{
        let data = req.body;
        if (Object.keys(data).length == 0) return res.status(400).send({ statua: false, message: "Please provide login details!!" })

        const { email, password } = data

        if (!isValid(email))  return res.status(400).send({ status: false, message: "Email is required!!" })
        
        if (!isValid(password))  return res.status(400).send({ status: false, message: "Password is required!!" })

      
        let userid = await userModel.findOne({ email: email })
        if (!userid) return res.status(400).send({ status: false, message: "Email or password is not registered plss register first" });

        // ---------------------------decoding hash password---------------------------------------------------------
        const matchPass = bcrypt.compare(password, userid.password);
        
        if (!matchPass) 
            return res.status(400).send({ status: false, message: "You Entered Wrong password" })
        
        // using jwt for creating token
        let token = jwt.sign(
            {
                userId: userid._id.toString(),
                iat : Math.floor(Date.now() / 1000),
            },
            "Project5-Group56",
            { expiresIn: "10 min" });
       let obj = {
        userId:userid._id,
        token:token
       }

        res.status(200).send({ status: true, message: "Success", data: obj });
    }
    catch(err){
        res.status(500).send({ status: false, Error: err.message });
    }
}

//----------------------fetching user data api-------------------------------------------------------------------------
const getuser = async function (req, res) {
    try {
        let id = req.params.userId;
        if (!mongoose.Types.ObjectId.isValid(id)) { return res.status(400).send({ status: false, message: 'Please provide valid UserId for details' }) }

        let userDetails = await userModel.findById(id);
        if (!userDetails) { return res.status(404).send({ status: false, message: 'No user details found with this id' }) }

        return res.status(200).send({ status: true, message: 'User profile Details', data: userDetails })

    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ message: error.message })
    }
}

const updateuser = async function(req,res){
    try{ 
        let data = req.body;
        let files = req.files;
        let userid = req.params.userId;
        
         if(Object.keys(data).length == 0 && files.length == 0)
         return res.status(404).send({ status: false, message: 'plss put some data for update' }) 
       
         let {fname, lname, email, phone, password, address} = data;

         if(fname){
            if (!isValid(fname) || !isValidName(fname) ) return res.status(400).send({ status: false, message: "first name is required!!" })
         }           








        if(files && files.length>0) {
            // res.send the link back to frontend/postman
            let uploadedFileURL= await uploadFile( files[0] )
            data.profileImage = uploadedFileURL
        }
        let updateuser = await userModel.findOneAndUpdate(
            {_id : userid },
            {
                $set : {
                     fname : fname, lname:lname, email:email,profileImage:  data.profileImage, phone:phone, password:password, address:address
                }
            },
            { new : true}
        )       

         if(!updateuser){
            return res.status(404).send({ status: false, message: "doscument is missing which you want to update or userid is wrong" })
         } else {
            return res.status(200).send({ status: true, message: "user profile updated", data: updateuser })
         }

    }catch (error) {
        console.log(error)
        return res.status(500).send({ message: error.message })
    }
}

module.exports = {userLogin,createuser,getuser,updateuser}