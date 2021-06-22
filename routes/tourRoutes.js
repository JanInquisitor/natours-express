const express = require("express");
const controller = require("../controllers/tourController");
const auth = require("../controllers/authController");

const router = express.Router();

//router.param('id', controller.checkID); For some reason this middleware isn't working.

router
  .route("/top-5-cheap")
  .get(controller.aliasTopTours, controller.getAllTours);

router.route("/tours-stats").get(controller.getTourStats);
router.route("/monthly-plan/:year").get(controller.getMonthlyPlan);

router
  .route("/")
    .get(auth.protect, controller.getAllTours)
    .post(controller.createTour);

router
  .route("/:id")
  .get(controller.getTour)
  .patch(controller.updateTour)
  .delete(controller.deleteTour);

module.exports = router;
