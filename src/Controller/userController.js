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
           const salt = await bcrypt.genSalt(10);
           body.password = await bcrypt.hash(body.password, salt);
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

      
        let userid = await userModel.findOne({ email: email})
        if (!userid) return res.status(400).send({ status: false, message: "Email is not registered plss register first" });

        // ---------------------------decoding hash password---------------------------------------------------------
        let encryptPwd = userid.password;

    await bcrypt.compare(password, encryptPwd, function (err, result) {
      if (result) {
        let token = jwt.sign(
          { _id: userid._id.toString() },
          process.env.SECRET_TOKEN,
          {
            expiresIn: "1h",
          }
        );
        res.setHeader("x-api-key", token);

        return res.status(200).send({
          status: true,
          message: "User login successfull",
          data: { userId: userid._id, token: token },
        });
      } else {
        return res
          .status(401)
          .send({ status: false, message: "Invalid password!" });
      }
    });
  } catch (err) {
    res.status(500).send({ staus: false, msg: err.message });
  }
};

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

//-----------------------------------updateuser---------------------------------------------------------------------------------
const updateuser = async function (req, res) {
    try {
      const data = req.body;
      const userId = req.params.userId;
      const files = req.files;
      const update = {};
  
      const { fname, lname, email, phone, password, address } = data;
  
      if (Object.keys(data).length == 0 && !files) return res.status(400).send({status: false,message: "Please provide data in the request body!"});
      
      if (fname) {
        if (!isValid(fname) || !isValidName(fname)) return res.status(400).send({ status: false, message: "fname is invalid" });  
        update["fname"] = fname;
    }
      
      if (lname) {
        if (!isValid(lname) || !isValidName(lname)) return res.status(400).send({ status: false, message: "lname is invalid" });
        update["lname"] = lname;
      }
  
      if (email) {
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "Email is invalid!" });
  
        let userEmail = await userModel.findOne({ email: email });
        if (userEmail) return res.status(409).send({status: false, message:"This email address already exists, please enter a unique email address!"});
        update["email"] = email;
      }
  
      if (phone) {
        if (!isValidNumber(phone)) return res.status(400).send({ status: false, message: "Phone is invalid" });
        let userNumber = await userModel.findOne({ phone: phone });
        if (userNumber)
          return res.status(409).send({status: false,message:"This phone number already exists, please enter a unique phone number!"});
        update["phone"] = phone;
      }
  
      if (password) {
        if (!isValidPassword(password)) return res.status(400).send({status: false,message:"Password should be strong, please use one number, one upper case, one lower case and one special character and characters should be between 8 to 15 only!"});
   
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
  
        let encryptPassword = data.password;
         update["password"] = encryptPassword;
      }  
  
      if (address) {
        const { shipping, billing } = address;
  
        if (shipping) {
          const { street, city, pincode } = shipping;
  
          if (street) {
            if (!isValid(address.shipping.street)) return res.status(400).send({ status: false, message: "Invalid shipping street!" });
            update["address.shipping.street"] = street;
          }
  
          if (city) {
            if (!isValid(address.shipping.city)) return res.status(400).send({ status: false, message: "Invalid shipping city!" });
            update["address.shipping.city"] = city;
          }
  
          if (pincode) {
            if (!isValidPincode(address.shipping.pincode)) return res.status(400).send({ status: false, message: "Invalid shipping pincode!" });
            update["address.shipping.pincode"] = pincode;
          }
        }
  
        if (billing) {
          const { street, city, pincode } = billing;
  
          if (street) {
            if (!isValid(address.billing.street)) return res.status(400).send({ status: false, message: "Invalid billing street!" });
            update["address.billing.street"] = street;
          }
  
          if (city) {
            if (!isValid(address.billing.city)) return res.status(400).send({ status: false, message: "Invalid billing city!" });
            update["address.billing.city"] = city;
          }
  
          if (pincode) {
            if (!isValidPincode(address.billing.pincode)) return res.status(400).send({ status: false, message: "Invalid billing pincode!" });
            update["address.billing.pincode"] = pincode;
          }
        }
      }
  
      if (files && files.length > 0) {
        let uploadedFileURL= await uploadFile( files[0] )
  
        update["profileImage"] = uploadedFileURL;
      }
      const updateUser = await userModel.findOneAndUpdate(
        { _id: userId },
        update,
        { new: true }
      );
      return res.status(200).send({
        status: true,
        message: "user profile successfully updated",
        data: updateUser,
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

module.exports = {userLogin,createuser,getuser,updateuser}