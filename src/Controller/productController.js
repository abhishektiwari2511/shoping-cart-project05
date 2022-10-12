const productModel = require("../Model/productModel");
const { uploadFile } = require("../aws/awscontroller");

const { isValid, isValidName, isvalidPrice,isValidAvailableSizes } = require("../validator/validator")

const createProduct = async function(req,res){
    try{
        let data = req.body;
        let {title, description, price, currencyId, currencyFormat, style, availableSizes, installments, deletedAt} = data;
        let files = req.files;  

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "plss put some data in body" })

        if (!isValid(title)) return res.status(400).send({ status: false, message: "title is required!!" })

        const newtitle = await productModel.findOne({ title });
        if (newtitle) return res.status(400).send({ status: false, message: "title is already present" })
    
        if (!isValidName(title)) return res.status(400).send({ status: false, message: "input valid title" })
    
    
        if (!isValid(price)) return res.status(400).send({ status: false, message: "price is required!!" })

        if (!isvalidPrice(price)) return res.status(400).send({ status: false, message: "price is invalid" })

            if(currencyId || currencyId == '') {
        if (currencyId != "INR" || !isValid(currencyId)) return res.status(400).send({ status: false, message: "currencyId is invalid" })
            }

            if(currencyFormat || currencyFormat == '') {
                if (currencyFormat != "₹" || !isValid(currencyFormat)) return res.status(400).send({ status: false, message: "currencyFormat is invalid" })
                    }
            
          if(style || style == '') {
          if ( !isValidName(style)) return res.status(400).send({ status: false, message: "style is invalid" })
              }
            
       if (!isValid(availableSizes)) return res.status(400).send({ status: false, message: "availableSizes is required" })
    
        if (!isValidAvailableSizes(availableSizes)) return res.status(400).send({ status: false, message: "AvailableSizes is required" })
         
        if(installments){
        if (!isValid(installments) || !isvalidPrice(installments)) return res.status(400).send({ status: false, message: "installments must be valid" });
        }
         
        if (files && files.length > 0) {
            // res.send the link back to frontend/postman
            let uploadedFileURL = await uploadFile(files[0])
            data.productImage = uploadedFileURL
          }
          else {
            return res.status(400).send({ message: "No file found" })
          }

        let newproduct = await productModel.create(data);
        return res.status(201).send({status: true, message: "product create succesfully", data: newproduct})

    }catch (err) {
        return res.status(500).send({ message: err.message })
      }
}

module.exports.createProduct=createProduct;