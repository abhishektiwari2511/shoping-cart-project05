const isValidPassword = function (password) {
    if(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(password)) return true;
    return false;
  };
  
  const isValidName = function (string) {
      let regex = /^[a-zA-Z\\s]{2,20}$/;
      if (regex.test(string)) {
          return true;
      }
      return false;
  };
  
  const isValidNumber = function (number) {
    if (/^[0]?[6789]\d{9}$/.test(number)) return true;
    return false;
  };
  
  const isValidId = function (id) {
    return mongoose.Types.ObjectId.isValid(id);
  };
  
  const isValidPincode =function (pincode) {
    if(/^[1-9][0-9]{5}$/.test(pincode)) return true ;
    return false;
  };
  
  const isValidEmail = function (mail) {
    if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(mail)) return true;
      return false;
  };
const isValid = function (value) {
    if (typeof value == undefined || value == null || value.length == 0) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };

  /^[0-9]+$/ // NUMBERS
  const isvalidPrice = function(Price) {
    if( /^[0-9]+$/.test(Price)) return true;
    return false;
  }

  const isValidAvailableSizes = (availablesizes) => {
    for( i=0 ;i<availablesizes.length; i++){
      if(!["S", "XS","M","X", "L","XXL", "XL"].includes(availablesizes[i]))return false
    }
    return true
};

module.exports = { isValidName, isValidNumber, isValidId, isValidPincode, isValidEmail, isValid ,isValidPassword, isvalidPrice,isValidAvailableSizes }