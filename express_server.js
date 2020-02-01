//when  --->  listen EADDRINUSE  -->  pkill node
const cookieSession = require('cookie-session');
const express = require("express");
const bcrypt = require('bcrypt');
const app = express();
app.use(cookieSession({
  name: 'session',
  keys: ['key1'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
getUserByEmail = require("./helpers")

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

function generateRandomString() {
  const length = 6;
  return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}
let users = {
  "userRandomID": {
    id: "userRandomID",
    email: "u@e.com",
    password: "pmd"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

 

// LIST OF USER CREATED URLS
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};


// REGISTER USER
//ADD USER TO USERS LIST & SET COOKIE
//const password = "erer"; // found in the req.params object
//const hashedPassword = bcrypt.hashSync(password, 10);



app.post("/register", (req, res) => {

  let registerVars = {
    id: String(generateRandomString()),
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)

  };
  if (registerVars["email"].length === 0 || registerVars["password"].length === 0) {
    console.error("post register error " + res.statusCode + ": either password or email field is empty");
    res.status(400).redirect("/register");
  } else {
    for (const elem in users) {
      if (users[elem].email === req.body.email) {
        res.status(400);
        console.log("post register error " + res.statusCode + ": Email address already exists");
        return res.redirect("/login");
      }
    }
    
    users[registerVars["id"]] = registerVars;
      //console.log("TCL: registerVars;", registerVars)
     //console.log("TCL: users[registerVars['id]]", users)
    res.redirect("/login")
  }
});
    //LINK IN HEADER TO REGISTRATION PAGE
app.get("/register", (req, res) => {
  let templateVars = {
    user_id: req.session.user_id
  }
  res.render("urls_register", templateVars);
});

   //LINK IN HEADER TO LOGIN PAGE
app.get("/login", (req, res) => {

  let templateVars = {
    urls: urlDatabase,
    user_id: req.session.user_id,
    shortURL: req.params.shortURL,
    longURL: req.body.newURL,
    
  }
  
  res.render("urls_login", templateVars);
});

//LOGIN FORM SUBMIT BUTTON
app.post("/login", (req, res) => {
  for (const elem in users)
  if (((users[elem].email === req.body.email) === true) &&
      bcrypt.compareSync(req.body.password, users[elem].password) === true) {
      //res.cookie("username", req.body.username)// <-options[]
      //res.cookie("username", req.body.username)
      //res.cookie("user_id", users[elem].id);
      //let userID = users[elem].id  
      
      req.session.user_id = users[elem].id;
      //req.session.user_email = users[elem].email
      
     res.redirect("/urls");
     return
    }
  res.statusCode = 403;
  console.log("Error " + res.statusCode + ": email or password not found");
  res.redirect("/login")
})

//LOGOUT LINK
app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect('/login');
})

//LINK TO URL LIST
app.get("/urls", (req, res) => {
  if (!req.session.user_id) {res.redirect("/bad_request"); return};
  let templateVars = {
    urls: urlsForUser(req.session.user_id),
    user_id: req.session.user_id,
  
    }
  res.render("urls_index", templateVars);
});

//LINK TO CREATION PAGE WITHOUT COOKIE
app.get("/bad_request", (req, res) => {
let templateVars = {
  urls: urlsForUser(req.session.user_id),
    user_id: req.session.user_id,
  }
  res.render("bad_request", templateVars)
});

// LINK TO URL CREATION PAGE
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {res.redirect("/bad_request"); return};
  let templateVars = {
    urls: urlDatabase,
    user_id: req.session.user_id,
    shortURL: req.params.shortURL,
    longURL: req.body.newURL
  }
  res.render("urls_new", templateVars);
});


//BUTTON TO SUBMIT NEW URL TO URL LIST
app.post("/urls", (req, res) => {

  let urlVars = {
    shortURL: String(generateRandomString()),
    longURL: req.body.longURL,
    userID: req.session.user_id
  }
  urlDatabase[urlVars["shortURL"]] = { longURL: urlVars["longURL"], userID: urlVars["userID"]};  
  //[urlVars['shortURL']] = urlVars['longURL']
  res.redirect("/urls/");
});

//FUNCTION ALLOWING ONLY USERS TO SEE THEIR URLS
const urlsForUser = (user) => {
  let results = { };
  for (const elem in urlDatabase) {
    if (user === urlDatabase[elem]["userID"]) {
      results[elem] = {
        shortURL: elem,
        longURL: urlDatabase[elem]['longURL']
      }
    }
  }
  return results
}

//EDIT BUTTON ON URLS LIST PAGE TO REDIRECT TO EDIT PAGE
app.get("/urls/:shortURL/edit", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user_id: req.session.user_id,

  };
  res.render("urls_show", templateVars);
})

//BUTTON ON EDIT PAGE TO SUBMIT UPDATED URL
app.post("/urls/:shortURL", (req, res) => {
  //res.render("urls_index", templateVars);
  let templateVars = {
    urls: urlsForUser(req.session.user_id),
    user_id: req.session.user_id,
    shortURL: req.params.shortURL,
    longURL: req.body.newURL
  };//URLS_INDEX CONTAINS^^^^^^^^^^^^^^^^^^^^^^
  urlDatabase[req.params.shortURL] = { longURL: templateVars["longURL"], userID: templateVars["user_id"]};
  res.render("urls_show", templateVars);
});


//DELETE BUTTON ON URLS LIST TO DELETE URL
app.get("/urls/:shortURL/delete", (req, res) => {
  //console.log(req.params.shortURL) 
  //console.log(urlDatabase)
  if (urlDatabase[req.params.shortURL]["userID"] !== req.session.user_id) 
  {res.redirect('/urls')} 
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls')//////////////WWORKING HEREEERER
})



app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user_id: req.session.user_id
  };
  res.render("urls_show", templateVars);
}); 

//SHORT URL LINK TO ACTUAL WEBSITE
app.get("/u/:shortURL", (req, res) => {
  if (!req.session.user_id) {res.redirect("/bad_request"); return} 
  
  console.log(req);
  console.log(req.session.user_id);
  //else if (req.session.user_id !== urlDatabase[elem]["userID"]) {res.redirect("/bad_request"); return}; 
  //const longURL = urlDatabase[req.params.shortURL];
  
  //res.redirect(longURL["longURL"]);
});

