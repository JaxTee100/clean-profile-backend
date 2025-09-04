import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { errorHandler } from './middleware/errorHandler';
import projectRoutes from './routes/projectRoutes';
import cors from 'cors';


dotenv.config();
const app = express();
const port = process.env.PORT || 3001;



// ✅ Correct CORS config for local frontend at localhost:3000
app.use(cors({
  origin: process.env.ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // header names only
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/projects', projectRoutes);
app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Nodemon + TypeScript!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


