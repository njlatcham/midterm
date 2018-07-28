"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
const bcrypt        = require("bcryptjs");
const cookieSession = require("cookie-session");
const api           = require("api")

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

const DataHelpers = require("./db/util/data-helpers.js")(knex);

const usersRoutes = require("./routes/users")(DataHelpers);

// Seperated Routes for each Resource
//const usersRoutes = require("./routes/users");
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
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

// ******************************************************
// FUNCTIONS




// ******************************************************

// Home page
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/personal", (req, res) => {
  res.render("personal");
})

app.post("/personal", (req,res) => {
  const userName = req.body.username;
  const userPassword  = req.body.password;

  DataHelpers.dbCheckUser(userName, userPassword)
  .then(function(data) {
    console.log('X',data);
    if (!data) {
      res.status(403).send('Username or Password is incorrect - please check again')
    } else {
      console.log("Success");
      res.redirect("/personal");
    }
  });
});


// app.post("/session", (req,res) => {
//   res.redirect("/");
// });

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
let templateVar = {
  userName : req.body.username,
  password : req.body.password,
  email : req.body.email,
  first_name : req.body.firstName,
  last_name : req.body.lastName,
  address : req.body.address,
  mobile : req.body.telephone,
  dob : req.body.birthdate || "01/01/1980",
  gender : req.body.gender || "U"
}
  console.log(req.body);
  DataHelpers.dbInsertUser(templateVar)
  .then(function(data) {
    if (!data) {
      res.status(403).send('Username already exists - try a different one')
    } else {
      console.log("Success");
      res.render("personal");
    }
  });

});

app.get("/tasks", (req, res) => {
  res.render("tasks");
});

app.get("/tasks/new", (req, res) => {
  res.render("newTask");
});

app.post("/tasks", (req, res) => {
  let templateVar = {
    task_name : "Hard Disk",
    userid: "1", 
    category_id : "4", 
    url : "www.seagate.com", 
    priority : "false", 
    status : "false"
  }
  console.log(req.body);
  DataHelpers.dbInsertTask(templateVar)
  .then(function(data) {
    if (!data) {
      res.status(403).send('Failed to Insert')
    } else {
      console.log("Success");
      res.render("personal");
    }
  });      
  // res.redirect("/tasks"); // redirect to tasks of specific id
});

// displays page of a tasks of a specific id
app.get("/tasks/:id", (req, res) => {
  res.render("tasks");
});

// displays page of tasks for editing for a specific id
app.get("/tasks/:id/edit", (req, res) => {
  res.render("tasks/edit");
});

// add a task of a specific id
app.put("/tasks/:id", (req, res) => {
  res.redirect("/tasks/:id");
});

// delete call for removing specific task
app.delete("/tasks/:id", (req, res) => {
  res.redirect("/tasks");
});

// displays profile editing page of specific user
app.get("/profile/:userName", (req, res) => {

let templateVars = {};
const userName = req.params.userName;

  res.render("profile", templateVars);

});

// updates user profile
app.put("/profile", (req, res) => {
  res.redirect("/tasks"); // TBD
});


// ******************************************************

app.listen(PORT, () => {
    console.log("Example app listening on port " + PORT);
});
