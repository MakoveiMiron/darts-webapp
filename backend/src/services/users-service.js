import { createUser, getUserDataById, getUsernamesById} from "../database/models/users-model";


    export function updateUserService(payload){
        return createUser(payload);
    }
    export function getRoomUsersService(payload){
        return getUsernamesById(payload.userId1, payload.userId2)
    }
    export function getUserDataByIdService(payload){
        return getUserDataById(payload)
    }
