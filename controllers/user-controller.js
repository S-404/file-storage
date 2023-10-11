const userService = require('../services/user-service')

const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000 //7days

class UserController {


    async registration(req, res, next) {
        try {
            const {username, password, authCode} = req.body
            const userData = await userService.registration(username, password, authCode)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: REFRESH_TOKEN_MAX_AGE, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const {username, password} = req.body
            const userData = await userService.login(username, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: REFRESH_TOKEN_MAX_AGE, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)

        } catch (e) {
            next(e)
        }
    }

    async refreshToken(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: REFRESH_TOKEN_MAX_AGE, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers()
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params
            const {username, isActivated, isAdmin} = req.body
            const userData = await userService.update({
                id,
                username,
                isActivated,
                isAdmin,
            })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const userData = await userService.delete({id})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async generateAuthCode(req, res, next) {
        try {
            const {userId} = req.params
            const authCodeData = await userService.generateAuthCode({userId})
            return res.json(authCodeData)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()