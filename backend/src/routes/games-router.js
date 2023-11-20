import express from "express";
import gameController from "../controllers/game-controller";
const router = express.Router();

router.post('/games', gameController.createGameRoom);
router.patch('/games/join/:roomId', gameController.joinGameRoom);
router.patch('/games/leave/:roomId', gameController.leaveGameRoom);
router.delete('/games/:roomId', gameController.deleteGameRoom);

export default router;