const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// middleware
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(bodyParser.urlencoded({ extended: true }));
// database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "skul",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySql Connected...");
});
app.get("/", (req, res) => {
  const sql = "SELECT * FROM skul";
  db.query(sql, (err, result) => {
    if (err) throw err;
    // console.log(result);
    // console.log("hasil database " + data);
    var resultArray = JSON.parse(JSON.stringify(result));
    res.render("index", { resultArray, title: "Daftar Murid" }); // data: data");
  });
});
app.get("/chat", (req, res) => {
  res.render("chat", { title: "Test Chat", chatRoom : "Diskusi" }); // data: data");
});

app.post("/", (req, res) => {
  const insert = `INSERT INTO skul(name, kelas) VALUES ('${req.body.nama}', '${req.body.kelas}')`;
  console.log(req.body.name);
  db.query(insert, (err, result) => {
    if (err) throw err;
    console.log(result);
    console.log("Data berhasil ditambahkan");
    res.redirect("/");
  });
});
app.get("/delete/:id", (req, res) => {
  const sql = `DELETE FROM skul WHERE id=${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    console.log("Data berhasil dihapus");
    res.redirect("/");
  });
});

io.on("connection", (socket) => {
  console.log("User connected");
  socket.on("chat message", (data) => {
   const {id, message} = data; 
   console.log(id, message)
    socket.broadcast.emit("chat message", id, message);
  });
});

server.listen(port, () => {
  console.log("server berjalan di " + port);
});
