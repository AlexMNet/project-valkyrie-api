import * as dotenv from 'dotenv';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import recordRouter from './Record/record.router';
import authRouter from './Auth/auth.router';
import globalErrorController from './Error/globalError.controller';
import AppError from './utils/appError';
import 'express-async-errors';
import cookieParser from 'cookie-parser';

dotenv.config();

// If there is no port defined in the environment variables, exit the process
if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api/records', recordRouter);
app.use('/api/auth', authRouter);

app.get('/', (request: Request, response: Response, next: NextFunction) => {
  response.send('Project Valkyrie!');
});

app.get('/api/healthcheck', (request: Request, response: Response) => {
  const data = {
    uptime: process.uptime(),
    message: 'Ok',
    date: new Date(),
    info: 'Project Valkyrie. For more information visit, https://github.com/AlexMNet/project-valkyrie-api',
  };
  response.status(200).send(data);
});

app.all('*', (request: Request, response: Response, next: NextFunction) => {
  next(new AppError(404, 'Sorry, this endpoint cannot be found.'));
});

app.use(globalErrorController);

app.listen(PORT, () => {
  console.log(
    `App listening on port ${PORT} in ${process.env.NODE_ENV} mode...`
  );
});
