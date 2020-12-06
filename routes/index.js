const express = require('express')
const router = express.Router()

const routes = require('./routes')
const apis = require('./apis')

router.use('/api', apis)
router.use('/', routes)

module.exports = router