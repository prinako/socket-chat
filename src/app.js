const express = require("express");
const expressLayout = require("express-ejs-layouts");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
cors: { 
  origin: "http://localhost:3000"
}
});
const path = require("path");

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(expressLayout);
app.use(express.urlencoded({ extended: true }));
app.set("layout", "./layout/layout");
app.use(express.static(path.join(__dirname, "public")));

let userName;

app
  .route("")
  .post((req, res) => {
    userName = req.body.userName;
    res.redirect("/connectME");
  })
  .get((req, res) => {
    res.render("index");
  });

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);
  socket.on("send_message", (msg, room) => {
    socket.broadcast.to(room).emit("receive_message", msg, id);
  });
});

const port = process.env.PORT || 5500;
server.listen(port, () => console.log(`on port ${port}`));
