const express = require('express');
const controller = require('../controllers/tourController');

const router = express.Router()

//router.param('id', controller.checkID); For some reason this middleware isn't working.

router
	.route('/')
	.get(controller.getAllTours)
	.post(controller.createTour)

router
	.route('/:id')
	.get(controller.getTour)
	.patch(controller.updateTour)
	.delete(controller.deleteTour)

module.exports = router;
