import { createUser, getUserDataById} from "../database/models/users-model";


    export function updateUserService(payload){
        return createUser(payload);
    }
    export function getUserDataByIdService(payload){
        return getUserDataById(payload)
    }
