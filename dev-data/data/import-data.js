const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel");
const { exit } = require("process");

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
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
);

// IMPORT DATA INTO DATABASE
const importData = async () => {
  try {
    await Tour.create(tours);
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
