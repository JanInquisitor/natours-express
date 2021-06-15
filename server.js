const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught exception! Shutting down.");
  process.exit(1);  
});

dotenv.config({ path: "./config.env" });

const db = process.env.DATABASE;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((/*con*/) => {
    // console.log(con.connections);
    console.log("Database connection successfull");
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`App running at port ${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection! Shutting down.");
  server.close(() => {
    process.exit(1);
  });
});
