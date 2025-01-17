import express from 'express';
import dotenv from 'dotenv';
import { setupSwagger } from './common/swagger';
import errorHandler from './middleware/errorHandler';
import userRoutes from './modules/user/user.routes';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use(errorHandler);
setupSwagger(app);

export default app;
