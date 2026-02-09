const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routers/user.router");
const CookieParser = require("cookie-parser");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;
const MONGODB = process.env.MONGODB;

// Middleware
app.use(
  cors({
    origin: [BASE_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//callback funtion
app.get("/", (req, res) => {
  res.send("WELCOME TO MERN CHAT SERVER");
});
//connect to DB
if (!MONGODB) {
  console.log("NO MONGODB URL found in dotenv");
} else {
  mongoose
    .connect(MONGODB)
    .then(() => {
      console.log("Connect to database successfully!");
    })
    .catch((error) => {
      console.log("Mongo DB connection error:", error);
    });
}
//use router
app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
