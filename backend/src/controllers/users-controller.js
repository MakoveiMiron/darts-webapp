import usersService from "../services/users-service";

export default {
    updateUser(req, res, next){
        usersService.updateUser()
        .then((userData) => {
            res.status(200).send(userData)
        })
        .catch(next)
    },
    getUserDataById(req, res, next){
        const { id } = req.params
        usersService.getUserDataById(id)
        .then((userData) => {
            res.status(200).send(userData)
           })
        .catch(next)
    }
}