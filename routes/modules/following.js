const express = require('express')
const router = express.Router()

const userController = require('../../controllers/userController')

router.post('/:userId', userController.addFollowing)
router.delete('/:userId', userController.removeFollowing)

module.exports = router