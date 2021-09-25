const express = require("express");
const expressLayout = require("express-ejs-layouts");
const app = express();
const server = require('http').Server(app)
const io = require("socket.io")(server);
const path = require("path");

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(expressLayout);
app.set("layout", "./layout/layout");
app.use(express.static(path.join(__dirname, "public")));

app.get("", (req, res) => {
  res.render("index");
});

io.on("connection", (socket) => {
  console.log(socket.id);
});

server.listen(5500, () => console.log("on port 5500"));
