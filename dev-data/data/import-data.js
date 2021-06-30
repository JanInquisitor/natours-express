const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { exit } = require("process");
const Tour = require("./../../models/tourModel");
const User = require("../../models/userModel");
const Review = require("../../models/userModel");

dotenv.config({ path: "./../../config.env" });

const db = process.env.DATABASE;
mongoose
  .connect("mongodb://localhost:27017/natours_db", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((/*con*/) => {
    // console.log(con.connections);
    console.log("Database connection successfull");
  });

// Read json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

// IMPORT DATA INTO DATABASE
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);

    console.log("Data succesfully loaded!");
  } catch (err) {
    console.log(err);
  }
  exit();
};

// DELETE ALL DATA FROM A COLLECTION
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data succesfully deleted!");
  } catch (err) {
    console.log(err);
  }
  exit();
};

if (process.argv[2] == "--import") {
  importData();
} else if (process.argv[2] == "--delete") {
  deleteData();
}

console.log(process.argv);
