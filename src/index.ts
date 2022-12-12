import * as dotenv from 'dotenv';
import express, { application } from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';

dotenv.config();

// If there is no port defined in the environment variables, exit the process
if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/healthcheck', (request: Request, response: Response) => {
  const data = {
    uptime: process.uptime(),
    message: 'Ok',
    date: new Date(),
    info: 'Project Valkyrie. For more information visit, https://github.com/AlexMNet/project-valkyrie-api',
  };
  response.status(200).send(data);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});
