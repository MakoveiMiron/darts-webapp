import { createGameRoom, startGame, deleteGameRoom, joinGameRoom, leaveGameRoom, getGameRooms} from "../database/models/game-model";
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
        return joinGameRoom(payload.userId, payload.roomId);
    }

    function leaveGameRoomService(payload){
        return leaveGameRoom(payload.roomId, payload.userId)
    }

    function startGameService(payload){
        return startGame(payload.roomId)
    }

    function getGameRoomsService(){
        return getGameRooms()
    }

    export {
        createGameRoomService,
        deleteGameRoomService,
        joinGameRoomService,
        leaveGameRoomService,
        startGameService,
        getGameRoomsService
    }