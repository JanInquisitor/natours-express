const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const viewRouter = require("./routes/viewRoutes")
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// GLOBAL MIDDLEWARES

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Set security HTTP Headers.
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Limit requests from same IP
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour.",
});
app.use("/api", limiter);

// Body parser
app.use(express.json({ limit: "10kb" }));

// Data Sanitization agaisnt NoSQL query injection
app.use(mongoSanitize());

// Data sanitization agaisnt XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/", viewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)); // <--- When this catches an error.
});

app.use(globalErrorHandler); // <--- this functions process the error.

module.exports = app;
