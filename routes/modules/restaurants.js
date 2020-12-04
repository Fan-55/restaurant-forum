const express = require('express')
const router = express.Router()
const restController = require('../../controllers/restController')

router.get('/', restController.getRestaurants)
router.get('/feeds', restController.getFeeds)
router.get('/top', restController.getTopRestaurant)
router.get('/:id/dashboard', restController.getDashboard)
router.get('/:id', restController.getRestaurant)

module.exports = router