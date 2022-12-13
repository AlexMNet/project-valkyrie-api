import * as dotenv from 'dotenv';
import express, { application, response } from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';
import { db } from './utils/db.server';

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

app.post('/users', async (request: Request, response: Response) => {
  // const {email, firstName, lastName, role} = request.body;
  try {
    const user = request.body;
    const newUser = await db.user.create({
      data: user,
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });
    response.status(200).json(newUser);
  } catch (error: any) {
    response.status(500).json(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});
