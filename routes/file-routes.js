const Router = require('express')
const fileController = require('../controllers/file-controller')


const router = new Router()

router.post('', fileController.createDir)

module.exports = router