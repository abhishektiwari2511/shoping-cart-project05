const isValidMail = (/^([0-9a-zA-Z]([-\\.][0-9a-zA-Z]+))@([a-z]([-\\.][a-z]+))[\\.]([a-z]{2,9})+$/);

const isValidName = (/^[a-zA-Z0-9,-. ]*$/)

const isValidPassword = (/(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,15}$/)

const isValidPhone = /^[6-9]{1}[0-9]{9}$/



module.exports = { isValidMail, isValidName, isValidPassword, isValidPhone }