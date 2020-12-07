const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

// const jwt = require('jsonwebtoken')
// const passportJWT = require('passport-jwt')
// const ExtractJwt = passportJWT.ExtractJwt
// const JwtStrategy = passportJWT.Strategy

// const jwtOptions = {}
// jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
// jwtOptions.secretOrKey = process.env.JWT_SECRET

// passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
//   try {
//     const user = await User.findByPk(jwt_payload.id, {
//       include: [
//         { model: Restaurant, as: 'FavoritedRestaurants' },
//         { model: Restaurant, as: 'LikedRestaurants' },
//         { model: User, as: 'Followers' },
//         { model: User, as: 'Followings' }
//       ]
//     })
//     if (!user) return done(null, false)
//     return done(null, user)
//   } catch (err) {
//     return done(err)
//   }
// }))

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