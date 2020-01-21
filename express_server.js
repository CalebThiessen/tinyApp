const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

function generateRandomString() {
  const length = 6;
  return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);

}
console.log(generateRandomString());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  
 
};
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
  console.log(longURL)
});
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL,longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});
app.post("/urls", (req, res) => {
  console.log(req.body);
  let urlVars = {
    shortURL: String(generateRandomString()),
    longURL: req.body.longURL,
  }
  res.render("urls_show", urlVars)
  res.send(urlDatabase[urlVars['shortURL']] = urlVars['longURL']);   
  console.log(urlDatabase);     // Respond with 'Ok' (we will replace this)
});
     app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
