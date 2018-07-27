"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
// we will need bcrypt and cookieSession in our package.json and express

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
// ******************************************************
// STANDARD CONSTANTS

const saltRounds = 10;



// ******************************************************
//USES

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
// app.use("/api/users", usersRoutes(knex));

app.use(bodyParser.urlencoded({extended: true}));


// USES cookieSession
// app.use(cookieSession({
//   name: 'session',
//   keys: ['key1', 'key2']
// }))

// ******************************************************
// FUNCTIONS




// ******************************************************

// Home page
app.get("/", (req, res) => {
    res.render("index");
});

app.post("/login", (req, res) => {
  console.log('Request', req.body);
  const userName = req.body.username;
  const password = req.body.password;
  knex
    .select('username', 'password')
    .from('todo_users')
    .where('username', userName || 0)
    .then((output) => {
      // console.log(output[0].username || 'Blank', output[0].password || 'Blank');
      // console.log(output);
      if (output.length > 0) {
        if (output[0].password !== password) {
          res.status(403).send('Username or Password is incorrect - please check again')
        } else {
          console.log('Success');
          res.render('personal');
        }
      } else {
        res.status(403).send('Username is not in the system')
      }
    })
    .catch(console.error)
});


app.post("/session", (req,res) => {
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const first_name = req.body.firstName;
  const last_name = req.body.lastName;
  const address = req.body.address;
  const mobile = req.body.telephone;
  const dob = req.body.birthdate || "01/01/1980";
  const gender = req.body.gender || "U";
  console.log(req.body);
  knex
  .select('id')
  .from('todo_users')
  .where('username', userName || 0)
  .then((output) => {
    if (output.length > 0) {
      res.status(403).send('Username already exists - try a different one')
    } else {  
      knex('todo_users')
      .insert({username: userName, password: password, email: email, first_name: first_name, last_name:last_name, address:address, mobile: mobile, dob: dob, gender: gender })
      .returning('id')
      .then( (newuser) => {
        console.log(newuser[0]);
        res.redirect('/');
      })
    }
  })
  .catch(console.error)
});

app.get("/tasks", (req, res) => {
  res.render("tasks");
});

app.get("/tasks/new", (req, res) => {
  res.render("newTask");
});

app.post("/tasks", (req, res) => {
  res.redirect("/tasks"); // redirect to tasks/:id eventually
});

app.get("/tasks/:id", (req, res) => {
  res.render("specifcTask");
});

app.get("/tasks/:id/edit", (req, res) => {
  res.render("editTask");
});

app.put("/tasks/:id", (req, res) => {
  res.redirect("/tasks/:id");
});

app.delete("/tasks/:id", (req, res) => {
  res.redirect("/tasks");
});

app.get("/profile/edit", (req, res) => {
  res.render("profileEdit");
});

app.put("/profile", (req, res) => {
  res.redirect("/tasks"); // TBD
});


// ******************************************************

app.listen(PORT, () => {
    console.log("Example app listening on port " + PORT);
});
