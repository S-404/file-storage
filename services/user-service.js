const bcrypt = require("bcryptjs")
const User = require('../models/User')
const File = require('../models/File')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')
const fileService = require('../services/file-service')
const tokenService = require('../services/token-service')

class UserService {

    async handleUserData(userData) {
        const userDto = new UserDto(userData)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.userId, tokens.refreshToken)

        return {user: userDto, ...tokens}
    }


    async registration(username, password, authCode) {
        const candidate = await User.findOne({username})
        if (candidate) {
            throw ApiError.BadRequest(`User ${username} already exist`)
        }
        const hashPassword = await bcrypt.hash(password, 8)
        const user = new User({username, password: hashPassword})
        await user.save()
        await fileService.createDir(new File({user: user.id, name: ''}))

        return await this.handleUserData(user)
    }

    async login(username, password) {
        const user = await User.findOne({username})
        if (!user) {
            throw ApiError.BadRequest(`User ${username} is not found`)
        }

        const isPass = await bcrypt.compare(password, user.password)
        if (!isPass) {
            throw ApiError.BadRequest('incorrect login/password')
        }

        return await this.handleUserData(user)
    }

    async logout(refreshToken) {

    }

    async update({
                     id,
                     username,
                     isActivated,
                     isAdmin,
                 }) {

    }

    async delete({id}) {

    }

    async refresh(refreshToken) {

    }
}

module.exports = new UserService()