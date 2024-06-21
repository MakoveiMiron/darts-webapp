import express from 'express';
import cors from 'cors';
import { FRONTED_URL } from './constants'
import apiRouter  from './routes/api-router'
import authRouter  from './routes/auth-router'
const app = express();

app.use(
  cors({
    // frontend server, fetch-es cookie felkuldest akarunk hasznalni
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  }),
);


app.use(express.json());

app.use('/api', apiRouter);
app.use('/auth', authRouter)

export default app