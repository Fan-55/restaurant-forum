const bcrypt = require('bcryptjs')
const { User } = require('../../models/index')
const jwt = require('jsonwebtoken')

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
  },
  signup: async (req, res, next) => {
    try {
      const { name, email, password, passwordCheck } = req.body
      const errors = {}
      //check required attributes
      if (!name) {
        errors.name = '名稱不可空白'
      }
      if (!email) {
        errors.email = 'Email不可空白'
      }
      if (!password) {
        errors.password = '密碼不可空白'
      }
      if (passwordCheck !== password) {
        errors.passwordCheck = '密碼和確認密碼不相符'
      }
      //check duplicate email
      const where = {}
      if (email) {
        where.email = email
      }
      const user = await User.findOne({ where, raw: true, nest: true })
      if (user) {
        errors.userExist = '此Email已註冊'
      }
      //if one of errors exists, go back to signup page
      if (Object.keys(errors).length) {
        return res.json({ status: 'error', message: errors })
      }
      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      req.body.password = hashedPassword
      await User.create(req.body)
      res.json({ status: 'success', message: '成功註冊帳號' })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = userController