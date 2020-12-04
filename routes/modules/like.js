const express = require('express')
const router = express.Router()

const userController = require('../../controllers/userController')

router.post('/:RestaurantId', userController.likeRestaurant)
router.delete('/:RestaurantId', userController.unlikeRestaurant)

module.exports = router