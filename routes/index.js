const express = require('express')
const router = express.Router()

const { authenticated, authenticatedAdmin } = require('../middleware/check-auth')

const restaurants = require('./modules/restaurants')
const users = require('./modules/users')
const admin = require('./modules/admin')
const comments = require('./modules/comments')

router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/restaurants', authenticated, restaurants)
router.use('/users', users)
router.use('/admin', authenticatedAdmin, admin)
router.use('/comments', comments)

module.exports = router