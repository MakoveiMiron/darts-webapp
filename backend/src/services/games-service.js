import { createGameRoom, deleteGameRoom, joinGameRoom, leaveGameRoom} from "../database/models/game-model";
export default{
    createGameRoom(payload){
       return createGameRoom(payload.roomId, payload.gameMode, payload.setCount, payload.userId);
    }, 
    
    deleteGameRoom(payload){
        return deleteGameRoom(payload);
    },

    joinGameRoom(payload){
        return joinGameRoom(payload.userId, payload.roomId);
    },

    leaveGameRoom(payload){
        return leaveGameRoom(payload.roomId, payload.userId)
    }
}