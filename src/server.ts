import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { errorHandler } from './middleware/errorHandler';
import projectRoutes from './routes/projectRoutes';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { logger } from './utils/logger';


dotenv.config();
const app = express();

const prisma = new PrismaClient();
const port = process.env.PORT || 3001;



// ✅ Correct CORS config for local frontend at localhost:3000
app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/projects', projectRoutes);
app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Nodemon + TypeScript!');
});

app.listen(port, async() => {
  await prisma.$connect();
  logger.info(`Server running at http://localhost:${port}`);

});


