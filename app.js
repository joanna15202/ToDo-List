// -----------
// Initialize
// -----------
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
const items = ["Buy Food"];
const workItems = [];
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.set('view engine', 'ejs'); // use ejs as its view engine

// -----------------------
// Show Date
// -----------------------
app.get("/", function(req, res) {

  const day = date.getDate();

  res.render('list', {
    listTitle: day,
    newListItem: items
  });

});

// -------------------------------
// Post the items that user inputs
// -------------------------------
app.post("/", function(req, res) {
  let item = req.body.newItem;
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/"); // redirect to the home route, which is app.get part
  }
})

// -----------------------
// Work route
// -----------------------
app.get("/work", function(req, res) {
  res.render('list', {
    listTitle: "Work List",
    newListItem: workItems
  });
})

// -----------------------
// Post the work items that user inputs
// -----------------------
app.post("/work", function(req, res) {
  let workItem = req.body.newItem;
  workItems.pusj(workItem);

  res.redirect("/work");
})

// -----------------------
// About route
// -----------------------
app.get("/about", function(req, res) {
  res.render("about");
})

// -------------------------------
// Listen
// -------------------------------
app.listen(3000, function() {
  console.log("The server is running on port 3000");
});
