const isValidPassword = function (password) {
    if(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(password)) return true;
    return false;
  };
  
  const isValidName = function (string) {
      let regex = /^[a-zA-Z\\s]{2,10}$/;
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

module.exports = { isValidName, isValidNumber, isValidId, isValidPincode, isValidEmail, isValid, isValidPincode,isValidPassword }