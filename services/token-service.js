const jwt = require('jsonwebtoken')
const Token = require('../models/Token')

class TokenService {

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return await tokenData.save()
        }
        const newToken = new Token({userId, refreshToken})
        await newToken.save()
        return newToken
    }

    async removeToken(refreshToken) {
        if(!refreshToken) return []

        return Token.deleteOne({refreshToken})
    }

    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'}, null)
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '1d'}, null)
        return {accessToken, refreshToken}
    }


    validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET, null, null)
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET, null, null)
        } catch (e) {
            return null
        }
    }

}

module.exports = new TokenService()