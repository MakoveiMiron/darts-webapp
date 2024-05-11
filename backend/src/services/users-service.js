import { createUser, getUserDataById, getUsernamesById} from "../database/models/users-model";


    export function updateUserService(payload){
        return createUser(payload);
    }
    export function getRoomUsersService(payload){
        return getUsernamesById(payload.myId, payload.opponentId)
    }
    export function getUserDataByIdService(payload){
        return getUserDataById(payload)
    }
