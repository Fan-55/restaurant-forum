const express = require('express')
const router = express.Router()

const { authenticated, authenticatedAdmin } = require('../../middleware/check-auth')
const commentController = require('../../controllers/commentController')

router.post('/', authenticated, commentController.postComment)
router.delete('/:id', authenticatedAdmin, commentController.deleteComment)

module.exports = router