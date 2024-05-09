import { createGameRoom, startGame, deleteGameRoom, joinGameRoom, leaveGameRoom, getGameRooms, getGameRoom} from "../database/models/game-model";
import { nanoid } from "nanoid";


    async function createGameRoomService(payload){
        const response = await createGameRoom(payload.roomId, payload.gameMode, payload.setCount, payload.legCount, payload.userId);
        console.log(response)
        return response
    } 
    
    function deleteGameRoomService(payload){
        return deleteGameRoom(payload);
    }

    function joinGameRoomService(payload){
        return joinGameRoom(payload.userId, payload.roomId, payload.socketId);
    }

    function leaveGameRoomService(payload){
        return leaveGameRoom(payload.roomId, payload.userId, payload.socketId)
    }

    function startGameService(payload){
        return startGame(payload.roomId)
    }

    function getGameRoomsService(){
        return getGameRooms()
    }

    function getGameRoomDataService(payload){
        return getGameRoom(payload)
    }

    export {
        createGameRoomService,
        deleteGameRoomService,
        joinGameRoomService,
        leaveGameRoomService,
        startGameService,
        getGameRoomsService,
        getGameRoomDataService
    }