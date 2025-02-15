import express from "express";
import pool from "./config/database.js";

const app = express();

pool.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to database");
  }
});

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
