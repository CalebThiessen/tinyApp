//FUNCTION RETURNS ID OF EMAIL ADDRESS INPUT
const getUserByEmail = function(email, users) {
    for (id in users) {
      if (users[id].email === email) {return id}
    }
  }
  module.exports = { getUserByEmail }