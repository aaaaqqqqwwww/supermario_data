const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary");
// const db = require("./routes/db");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
let db = null;
console.log(process.env.MONGO_PASS);
MongoClient.connect(`mongodb+srv://eunyoung:${process.env.MONGO_URL}@cluster0.oh6qak7.mongodb.net/?retryWrites=true&w=majority`, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.log(err);
  }
  db = client.db("crudapp");
});

app.use(cors());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
//post에서 보낸 데이터 res.body로 받으려면 있어야함
app.use(express.static(path.join(__dirname, "/public")));
app.use("/upload", express.static(path.join(__dirname, "/upload")));
app.set("port", process.env.PORT || 8099);
const PORT = app.get("port");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_COUND_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({
  // destination: (req, file, done) => {
  //   done(null, path.join(__dirname, "/upload"));
  // },
  // filename: (req, file, done) => {
  //   done(null, file.originalname);
  // },
});

const fileUpload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.render("index", { title: "오타쿠일지" });
});

app.get("/insert", (req, res) => {
  res.render("insert", { title: "글쓰기" });
});

app.post("/register", fileUpload.single("image"), (req, res) => {
  cloudinary.uploader.upload(req.file.path, (result) => {
    const title = req.body.title;
    const bg = req.body.bg;
    const desc = req.body.desc;
    const link = req.body.link;
    const category = req.body.category;
    const image = result.url;
    db.collection("supermario").insertOne({
      title: title,
      bg: bg,
      desc: desc,
      link: link,
      category: category,
      image: image,
    });
    res.send("잘 들어갔습니다");
  });
});

app.get("/mario", (req, res) => {
  db.collection("supermario")
    .find({ category: "mario" })
    .toArray((err, result) => {
      res.json({ items: result });
    });
  // res.json({
  //   item: [
  //     {
  //       img: "supermario01.png",
  //       title: "FLYING MARIO",
  //       bg: "radial-gradient( circle 929px at 0.6% 1.3%,  rgba(248,251,10,1) 0%, rgba(248,47,47,1) 82.6% )",
  //       desc: "For the past 35 years, Mario has been running, jumping, and saving the Mushroom Kingdom from bad guys, and he couldn’t have done it without you. Thank you for always being there to help Mario on his incredible adventures.",
  //       link: "https://mario.nintendo.com/",
  //       target: "_blank",
  //     },
  //   ],
  // });
});

app.get("/monster", (req, res) => {
  db.collection("supermario")
    .find({ category: "monster" })
    .toArray((err, result) => {
      res.json({ items: result });
    });
});

app.get("/all", (req, res) => {
  db.collection("supermario")
    .find()
    .toArray((err, result) => {
      res.json({ items: result });
    });
});

app.listen(PORT, () => {
  console.log(`${PORT}에서 서버 대기중`);
});
