module.exports = class UserDto {
    id
    userId
    username
    isActivated
    isAdmin
    constructor(model) {
        this.id = model.id
        this.userId = model.id
        this.username = model.username
        this.isActivated = model.isActivated
        this.isAdmin = model.isAdmin
    }
}

