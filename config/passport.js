const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

// setup passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  async (req, username, password, done) => {
    const user = await User.findOne({ where: { email: username } })
    if (!user) {
      return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
    }
    return done(null, user)
  }
))

// serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
  let user = await User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
  user = user.toJSON()
  return done(null, user)
})

module.exports = passport