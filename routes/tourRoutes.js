const express = require("express");
const controller = require("../controllers/tourController");
const reviewRouter = require("./../routes/reviewRoutes");
const auth = require("../controllers/authController");

const router = express.Router();

//router.param('id', controller.checkID); For some reason this middleware isn't working.
router.use(auth.protect);

router.use("/:tourId/reviews", reviewRouter);

router
  .route("/top-5-cheap")
  .get(controller.aliasTopTours, controller.getAllTours);

router.route("/tours-stats").get(controller.getTourStats);
router
  .route("/monthly-plan/:year")
  .get(
    auth.protect,
    auth.restrictTo("lead-guide", "admin", "user"),
    controller.getMonthlyPlan
  );

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(controller.getToursWithin);

router.route("/distances/:latlng/unit/:unit").get(controller.getDistances);

router
  .route("/")
  .get(controller.getAllTours)
  .post(
    auth.protect,
    auth.restrictTo("lead-guide", "admin"),
    controller.createTour
  );

router
  .route("/:id")
  .get(controller.getTour)
  .patch(
    auth.protect,
    auth.restrictTo("admin", "lead-guide"),
    controller.updateTour
  )
  .delete(
    auth.protect,
    auth.restrictTo("admin", "lead-guide"),
    controller.deleteTour
  );

// router
//   .route("/:tourId/reviews")
//   .post(auth.protect, auth.restrictTo("user"), reviewController.createReview); EXAMPLE CODE, please ignore.

module.exports = router;
