const fs = require('fs')
const File = require('../models/File')
const User = require('../models/User')
const {LOG} = require('../utils/log')
const ApiError = require('../exceptions/api-error')


class FileService {
    makeDir(file) {
        const filePath = `${process.env.FILE_PATH}\\${file.user}\\${file.path}`
        return new Promise(((resolve, reject) => {
            try {
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath)
                    return resolve({message: 'Dir was created'})
                } else {
                    return reject({message: 'Dir already exist'})
                }
            } catch (e) {
                return reject({message: 'Dir error'})
            }
        }))
    }

    async createDir({name, parent, user}) {
        LOG('createDir', arguments)
        const file = new File({name, type: 'dir', parent, user})
        const parentFile = await File.findOne({_id: parent})
        if (!parentFile) {
            file.path = name
            await this.makeDir(file)
        } else {
            file.path = `${parentFile.path}\\${file.name}`
            await this.makeDir(file)
            parentFile.childs.push(file._id)
            await parentFile.save()
        }
        await file.save()
        return file
    }

    getPath(file) {
        return `${process.env.FILE_PATH}\\${file.user}\\${file.path}`
    }

    deleteFile(file) {
        const path = this.getPath(file)
        if (file.type === 'dir') {
            fs.rmdirSync(path)
        } else {
            fs.unlinkSync(path)
        }
    }

    async uploadFile({userId, file, parent}) {
        const parentDir = await File.findOne({user: userId, _id: parent})
        const user = await User.findOne({_id: userId})

        let path = `${process.env.FILE_PATH}\\${user._id}\\${parent ? parent.path + '\\' : ''}${file.name}`
        if(fs.existsSync(path)){
            throw ApiError.BadRequest(`File already exist`)
        }
        await file.mv(path)

        const type = file.name.split('.').pop()
        let filePath = parent ? parent.path + "\\" + file.name : file.name
        const dbFile = new File({
            name: file.name,
            type,
            size: file.size,
            path: filePath,
            parent: parent?._id,
            user: user._id
        })

        await dbFile.save()
        await user.save()

        return dbFile
    }
}

module.exports = new FileService()