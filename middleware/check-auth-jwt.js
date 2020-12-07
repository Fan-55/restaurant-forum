const jwt = require('jsonwebtoken')
const { User, Restaurant } = require('../models/index')

module.exports = {
  authenticated: async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findByPk(data.id, {
        include: [
          { model: Restaurant, as: 'FavoritedRestaurants' },
          { model: Restaurant, as: 'LikedRestaurants' },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      req.user = user
      next()
    } catch (err) {
      res.status(401).json({ message: 'unauthorized' })
    }
  },
  authenticatedAdmin: (req, res, next) => {
    if (req.user) {
      if (req.user.isAdmin) {
        return next()
      }
      return res.redirect('/')
    }
    return res.redirect('/users/signin')
  }
}