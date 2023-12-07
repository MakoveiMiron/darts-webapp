import { createUser, getUserDataById} from "../database/models/users-model";

export default {
    updateUser(payload){
        return createUser(payload);
    },
    getUserDataById(payload){
        return getUserDataById(payload)
    }
}