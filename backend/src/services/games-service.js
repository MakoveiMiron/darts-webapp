import { createGameRoom, deleteGameRoom, joinGameRoom, leaveGameRoom} from "../database/models/game-model";
import { nanoid } from "nanoid";


    async function createGameRoomService(payload){
        const roomId = nanoid(16)
        const response = await createGameRoom(roomId, payload.gameMode, payload.setCount, payload.userId);
        console.log(response)
        return response
    } 
    
    function deleteGameRoomService(payload){
        return deleteGameRoom(payload);
    }

    function joinGameRoomService(payload){
        return joinGameRoom(payload.userId, payload.roomId);
    }

    function leaveGameRoomService(payload){
        return leaveGameRoom(payload.roomId, payload.userId)
    }

    export {
        createGameRoomService,
        deleteGameRoomService,
        joinGameRoomService,
        leaveGameRoomService
    }