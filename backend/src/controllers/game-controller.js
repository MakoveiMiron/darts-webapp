import gameService from "../services/games-service";
import isRoomEmpty from "../utils/isRoomEmpty";
import { nanoid } from "nanoid";

export default{
    createGameRoom(req,res,next){
        let roomId = nanoid(16)
        gameService.createGameRoom(roomId)
        .then( gameRoom => res.status(200).send(gameRoom))
        .catch(next)
    },
    
    async deleteGameRoom(req,res,next){
        const { roomId } = req.params
        let isEmpty = await isRoomEmpty(roomId)
        
        if(isEmpty){
            gameService.deleteGameRoom(roomId)
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

        gameService.joinGameRoom({roomId, userId})
        .then((data) => res.status(200).send(data))
        .catch(next);
    },

    leaveGameRoom(req, res, next){
        const { roomId } = req.params;
        const { userId } = req.body;

        gameService.leaveGameRoom({roomId,userId})
        .then((data) => res.status(200).send(data))
        .catch(next);
    }
}