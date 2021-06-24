const express = require("express");
const controller = require("../controllers/reviewController");
const auth = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(controller.getAllReviews)
  .post(auth.protect, auth.restrictTo("user"), controller.createReview);

module.exports = router;
