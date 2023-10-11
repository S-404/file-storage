
class UserService{

    async registration(username, password, authCode){

    }

    async login(username, password){

    }

    async logout(refreshToken){

    }

    async update({
                     id,
                     username,
                     isActivated,
                     isAdmin,
                 }){

    }

    async delete({id}){

    }

    async refresh(refreshToken){

    }
}

module.exports = new UserService()