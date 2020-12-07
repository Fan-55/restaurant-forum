const bcrypt = require('bcryptjs')
const { User } = require('../../models/index')

//JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  signIn: async (req, res, next) => {
    try {
      //check required fields
      if (!req.body.email || !req.body.password) {
        return res.json({ status: 'error', message: 'required fields didn\'t exist' })
      }

      const { email, password } = req.body

      const user = await User.findOne({ where: { email: email } })
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'User not found' })
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'Incorrect password' })
      }

      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      })

    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = userController