const express = require("express");
const controller = require("../controllers/reviewController");
const auth = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(controller.getAllReviews)
  .post(
    auth.protect,
    auth.restrictTo("user"),
    controller.setTourUserIds,
    controller.createReview
  );

router
  .route("/:id")
  .get(controller.getReview)
  .delete(auth.protect, controller.deleteReview)
  .patch(auth.protect, controller.updateReview);

module.exports = router;
