const express = require('express')
const router = express.Router()

const { authenticated, authenticatedAdmin } = require('../middleware/check-auth')

const restaurants = require('./modules/restaurants')
const users = require('./modules/users')
const admin = require('./modules/admin')
const comments = require('./modules/comments')
const favorite = require('./modules/favorite')
const like = require('./modules/like')
const following = require('./modules/following')

router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/restaurants', authenticated, restaurants)
router.use('/users', users)
router.use('/admin', authenticatedAdmin, admin)
router.use('/comments', comments)
router.use('/favorite', authenticated, favorite)
router.use('/like', authenticated, like)
router.use('/following', authenticated, following)

//error handling
router.use((req, res, next) => {
  const err = new Error('頁面不存在')
  err.status = 404
  next(err)
})
router.use((err, req, res, next) => {
  if (err.status !== 404) {
    err.status = 500
  }
  console.log('here')
  res.status(err.status || 500)
  res.render('error', { err })
})

module.exports = router