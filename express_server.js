//when  --->  listen EADDRINUSE  -->  pkill node
const cookieParser = require('cookie-parser');
const express = require("express");

const app = express();
app.use(cookieParser());
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

function generateRandomString() {
  const length = 6;
  return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL", (req, res) =>{
  //res.render("urls_index", templateVars);
    urlDatabase[req.params.shortURL] = req.body.newURL;
     let templateVars = { 
        urls: urlDatabase, 
        user_id: req.cookies["user_id"],
        shortURL: req.params.shortURL,
        longURL: req.body.newURL
      }; 
    //console.log(urlDatabase)
    res.render("urls_show", templateVars); 
});

const users = { 
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

app.post("/urls/:shortURL/edit", (req, res) =>{
  let templateVars = { shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user_id: req.cookies["user_id"]};
  res.render("urls_show", templateVars);
})

app.post("/urls/:shortURL/delete", (req,res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls')
})


/*app.post("/login", (req, res) =>{
  res.cookie("user_id", req.body.username)// <-options[]
  //console.log(req.body)
  res.redirect('/urls')
})*/

app.get("/logout", (req, res) => {
res.clearCookie("user_id");

 //res.redirect('/urls')
res.redirect('/login')
})

app.get("/login", (req, res) => {
  let templateVars = {
    urls: urlDatabase, 
    user_id: req.cookies["user_id"],
    shortURL: req.params.shortURL,
    longURL: req.body.newURL
  }
res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {

  for (const elem in users) 
     if (((users[elem].email === req.body.email) === true) && 
    (users[elem].password === req.body.password) === true) {
      //res.cookie("username", req.body.username)// <-options[]
      //res.cookie("username", req.body.username)
      //res.cookie("user_id", users[elem].id);
      res.cookie("user_id", users[elem].id);
      return res.redirect("/urls")}

  res.statusCode = 403;
  console.log("Error " + res.statusCode + ": email or password not found");
  res.redirect("/login")
})

app.get("/urls", (req, res) => {
  let templateVars = { 
    urls: urlDatabase, 
    user_id: req.cookies["user_id"],
    shortURL: req.params.shortURL,
    longURL: req.body.newURL
    }
   res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: urlDatabase, 
    user_id: req.cookies["user_id"],
    shortURL: req.params.shortURL,
    longURL: req.body.newURL
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user_id: req.cookies["user_id"]};
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = {
    user_id: req.cookies["user_id"]
  }
res.render("urls_register", templateVars);
});
//ADD USER TO USERS LIST & SET COOKIE
app.post("/register", (req, res) => {
 
  let registerVars = {
    id:String(generateRandomString()),
    email: req.body.email,
    password: req.body.password
  };
   if (((registerVars["email"].length) === 0) || 
  (registerVars["password"].length) === 0) {res.statusCode = 400;
  console.log("error " + res.statusCode 
  + ": either password or email field is empty");
    res.redirect("/urls");
     } else {
      for (const elem in users) {
      if (users[elem].email === req.body.email){
    res.statusCode = 400;
    console.log("error " + res.statusCode +": Email address already exists");
    return res.redirect("/urls");
    }
  } 
   //res.cookie("username", registerVars["id"])
   users[registerVars["id"]] = registerVars;
   res.redirect("/urls")
  
  }
 });
//ADD URL TO URLS LIST
app.post("/urls", (req, res) => {
  let urlVars = {
    shortURL: String(generateRandomString()),
    longURL: req.body.longURL,
  }
urlDatabase[urlVars['shortURL']] = urlVars['longURL']
res.redirect("/urls/" + urlVars['shortURL']);
});
/*
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  */