const express = require("express");
const controller = require("./../controllers/viewsController");

const router = express.Router();

router.get("/", controller.getOverview);
router.get("/tour/:slug", controller.getTour);

module.exports = router;
