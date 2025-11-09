import dotenv from 'dotenv';
import express from 'express';
import testRoute from './testRoute.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api', testRoute);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
