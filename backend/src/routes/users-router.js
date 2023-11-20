import express from 'express';
import userController from "../controllers/users-controller"

const router = express.Router();

router.get('/users/:id', userController.getUserDataById);
router.put('/users/:id', userController.updateUser)

export default router;