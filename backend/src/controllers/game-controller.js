import {
    createGameRoomService,
    deleteGameRoomService,
    joinGameRoomService,
    leaveGameRoomService,
    startGameService,
    getGameRoomsService
} from "../services/games-service"
import isRoomEmpty from "../utils/isRoomEmpty";
import { nanoid } from "nanoid";

export default{
    createGameRoom(req,res,next){
        let { gameMode, setCount, legCount, userId } = req.body
        let roomId = nanoid(16)
        createGameRoomService({roomId, gameMode, setCount, legCount, userId})
        .then( data => {
            console.log(roomId, userId)
            joinGameRoomService({roomId, userId})
            .then(info => console.log('info'))
            res.status(200).send(data.roomId)
        })
        .catch(next)
    },
    
    async deleteGameRoom(req,res,next){
        const { roomId } = req.params
        let isEmpty = await isRoomEmpty(roomId)
        
        if(isEmpty){
            deleteGameRoomService(roomId)
            .then((message) => res.status(200).send(message))
            .catch(next)
        }
        else{
            res.status(400).send(`The room with the id: ${roomId} is not empty!`)
        }
    },

    joinGameRoom(req, res, next){
        const { roomId } = req.params
        const { userId } = req.body

        joinGameRoomService({roomId, userId})
        .then((data) => res.status(200).send(data))
        .catch(next);
    },

    leaveGameRoom(req, res, next){
        const { roomId } = req.params;
        const { userId } = req.body;

        leaveGameRoomService({roomId,userId})
        .then((data) => res.status(200).send(data))
        .catch(next);
    }
}