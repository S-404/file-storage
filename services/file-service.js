const fs = require('fs')
const File = require('../models/File')
const {LOG} = require('../utils/log')


class FileService {
    makeDir(file) {
        const filePath =  `${process.env.FILE_PATH}\\${file.user}\\${file.path}`
        return new Promise(((resolve, reject)=>{
            try{
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath)
                    return resolve({message: 'File was created'})
                } else {
                    return reject({message: "File already exist"})
                }
            }catch (e) {
                return reject({message: 'File error'})
            }
        }))
    }

    async createDir({name, parent, user}){
        LOG('createDir', arguments)
        const file = new File({name, type: 'dir', parent, user})
        const parentFile = await File.findOne({_id: parent})
        if(!parentFile) {
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

    getPath(file){
        return `${process.env.FILE_PATH}\\${file.user}\\${file.path}`
    }

    deleteFile(file){
        const path = this.getPath(file)
        if(file.type === 'dir'){
            fs.rmdirSync(path)
        }else{
            fs.unlinkSync(path)
        }
    }
}

module.exports = new FileService()