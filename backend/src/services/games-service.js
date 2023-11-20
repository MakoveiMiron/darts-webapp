import gameModel from "../database/models/game-model";
export default{
    createGameRoom(payload){
       return gameModel.createGameRoom(payload);
    }, 
    
    deleteGameRoom(payload){
        return gameModel.deleteGameRoom(payload);
    },

    joinGameRoom(payload){
        return gameModel.joinGameRoom(payload.userId, payload.roomId);
    },

    leaveGameRoom(payload){
        return gameModel.leaveGameRoom(payload.roomId, payload.userId)
    }, 
    
    isRoomEmpty(payload){
        return gameModel.isRoomEmpty(payload)
    }
}