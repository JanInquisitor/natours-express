const express = require("express");
const controller = require("./../controllers/userController");
const reviewController = require("./../controllers/reviewController");
const auth = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", auth.signup);
router.post("/login", auth.login);

//I don't use this middleware because I want to be explicit with each route for future reference.
// router.use(auth.protect); 

router.post("/forgotPassword", auth.forgotPassword);
router.patch("/resetPassword/:token", auth.resetPassword);
router.patch("/updateMyPassword", auth.protect, auth.updatePassword);

router.get("/me", auth.protect, controller.getMe, controller.getUser);
router.patch("/updateMe", auth.protect, controller.updateMe);
router.delete("/deleteMe", auth.protect, controller.deleteMe);

router
  .route("/")
  .get(auth.protect, auth.restrictTo("admin"), controller.getAllUsers);

router
  .route("/:id")
  .delete(auth.protect, auth.restrictTo("admin"), controller.deleteUser)
  .patch(auth.protect, auth.restrictTo("admin"), controller.updateUser);

router
  .route("/:tourId/reviews")
  .post(auth.protect, auth.restrictTo("users"), reviewController.createReview);

module.exports = router;
