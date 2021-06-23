const express = require("express");
const controller = require("./../controllers/userController");
const auth = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", auth.signup);
router.post("/login", auth.login);

router.post("/forgotPassword", auth.forgotPassword);
router.patch("/resetPassword/:token", auth.resetPassword);

router.patch("/updateMyPassword", auth.protect, auth.updatePassword);

router.route("/").get(controller.getAllUsers);
// .post(createUser);

// router
// 	.route('/:id')
// 	.get(getUser)
// 	.patch(updateUser)
// 	.delete(deleteUser);

module.exports = router;
