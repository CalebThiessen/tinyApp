//FUNCTION RETURNS ID OF EMAIL ADDRESS INPUT
const getUserByEmail = function(email, users) {
    for (id in users) {
      if (users[id].email === email) {return id}
    }
  };
  
  

  const generateRandomString = function() {
    const length = 6;
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
  };

  
  module.exports = { getUserByEmail, generateRandomString};
