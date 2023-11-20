import express from "express";
import usersRouter from '../routes/users-router'
import gamesRouter from '../routes/games-router'

const router = express.Router();

router.use(usersRouter);
router.use(gamesRouter)


export default router