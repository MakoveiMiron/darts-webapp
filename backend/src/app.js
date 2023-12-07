import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api-router';
import authRouter from './routes/auth-router';
import { FRONTEND_URL } from './constants';

const app = express();

app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
    }),
);
app.use(express.json())
app.use('/api', apiRouter)
app.use('/auth', authRouter)

export default app