const express = require("express");
const controller = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);


router
	.route('/')
	.get(controller.getAllUsers)
	// .post(createUser);

// router
// 	.route('/:id')
// 	.get(getUser)
// 	.patch(updateUser)
// 	.delete(deleteUser);

module.exports = router;