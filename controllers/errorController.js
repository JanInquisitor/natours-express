const AppError = require("./../utils/appError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client.
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Dont leak error details.

    // 1) Log the error.
    console.error("Error: ", err);

    // 2) Send generic message to client.
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 404);
};

handleDuplicatedFieldsDB = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}, Please use another value!`;
  return new AppError(message, 404);
};

handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 404);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV == "development") {
    sendErrorDev(err, res);
  } else if ((process.env.NODE_ENV = "production")) {
    let error = { ...err };
    error = Object.assign(err);

    // So, mongoose removed the property "name" from the error object so in order to get name of the error
    // you need to extract it directly from the constructor like this: "err.constructor.name"
    // or use Object.assign() method to make an exact copy, either way it works.
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicatedFieldsDB(error);
    if (error.name === "ValidationError") error = handleValidationError(error);

    sendErrorProd(error, res);
  }
};
