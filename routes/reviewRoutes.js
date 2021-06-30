const express = require("express");
const controller = require("../controllers/reviewController");
const auth = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(auth.protect);

router
  .route("/")
  .get(controller.getAllReviews)
  .post(
    auth.restrictTo("user"),
    controller.setTourUserIds,
    controller.createReview
  );

router
  .route("/:id")
  .get(controller.getReview)
  .delete(
    auth.protect,
    auth.restrictTo("user", "admin"),
    controller.deleteReview
  )
  .patch(
    auth.protect,
    auth.restrictTo("user", "admin"),
    controller.updateReview
  );

module.exports = router;
