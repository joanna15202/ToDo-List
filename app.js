// -----------
// Initialize
// -----------
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = express();

// *********************
// Setup mongoose
// *********************
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

mongoose.connect('mongodb+srv://admin-joanna:test123@cluster0.e0ueg.mongodb.net/todolistDB', { // todolistDB is your database name
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// *********************
// Mongoose Schema
// *********************
const itemsSchema = {
  name: String
};

const listSchema = {
  name: String,
  items: [itemsSchema]
};

// *********************
// Mongoose Model
// *********************
const Item = mongoose.model('Item', itemsSchema); // item here needs to be a singular term. Mongoose will convert it to plural term automatically.
const List = mongoose.model('List', listSchema);

const item1 = new Item({
  name: "Buy food."
});

const item2 = new Item({
  name: "Workout."
});

const item3 = new Item({
  name: "Coffee."
});

// **************************
// Insert Data into Mongoose
// **************************
const defaultItems = [item1, item2, item3];


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.set('view engine', 'ejs'); // use ejs as its view engine

// -----------------------
// Home Route
// -----------------------
app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems) { // foundItems is the document you found here
    if (foundItems.length == 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Insert default items successfully!");
        }
      });
      res.redirect("/");
    } else {
      res.render('list', {
        listTitle: "Today",
        newListItem: foundItems
      });
    }
  });
});

// -------------------------------
// Post the items that user inputs
// -------------------------------
app.post("/", function(req, res) {
  let itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(item);
      foundList.save().then(function() {
        res.redirect("/" + listName);
      });

    })
  }
})

// -----------------------
// Delete route
// -----------------------
app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkedbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully delete!");
        res.redirect("/");
      }
    })
  } else {
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkedItemId
        }
      }
    }, function(err, foundList) {
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }
});

// -----------------------
// Dynamic route
// -----------------------
app.get("/:listName", function(req, res) {
  const customListName = _.capitalize(req.params.listName);

  List.findOne({
    name: customListName
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save().then(function() {
          res.redirect("/" + customListName);
        });

      } else {
        res.render('list', {
          listTitle: foundList.name,
          newListItem: foundList.items
        });
      }
    }
  })
});

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
  workItems.push(workItem);

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
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully.");
});
