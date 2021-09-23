const express = require('express');
const expressLayout = require('express-ejs-layouts');
const path = require('path')

const app = express();


app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(expressLayout)
app.set("layout", "./layout/layout")
app.use(express.static(path.join(__dirname, 'public')))

app.get("", (req, res) => {
  res.render("index");
});

app.listen(5500, () => console.log("on port 5500"));
