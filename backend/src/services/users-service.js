import usersModel from "../database/models/users-model";

export default {
    updateUser(payload){
        return usersModel.createUser(payload);
    },
    getUserDataById(payload){
        return usersModel.getUserDataById(payload)
    }
}