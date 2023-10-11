const fileService = require('../services/file-service')
const File = require('../models/File')

class FileController {
    async createDir(req, res, next) {
        try {
            const {name, parent} = req.body
            const user = req.user.id
            const dir = await fileService.createDir({name, parent, user})
            return res.json(dir)
        } catch (e) {
            next(e)
        }
    }

    async uploadFile(req, res, next) {
        try {
            const file = req.files.file
            const userId = req.user.id
            const {parent} = req.body
            const result = await fileService.uploadFile({userId, file, parent})
            res.json(result)
        } catch (e) {
            next(e)
        }
    }

    async getFiles(req, res, next) {
        try {

        } catch (e) {
            next(e)
        }
    }

    async downloadFile(req, res, next) {
        try {

        } catch (e) {
            next(e)
        }
    }

    async
}

module.exports = new FileController()