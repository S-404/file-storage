const ApiError = require('../exceptions/api-error')
const {LOG} = require('../utils/log')


module.exports = function (err, req, res, next) {
    LOG('error mw got', err)

    if (err instanceof ApiError) {
        return res.status(err.status).json({
            message: err.message,
            errors: err.errors,
        })
    }

    return res.status(500).json({message: err?.message ?? 'unexpected error', errors: err.errors})
}