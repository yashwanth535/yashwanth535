import express from 'express';
import dotenv from 'dotenv';
import statsRoute from './api/stats.js';
import streakRoute from './api/streak.js';

dotenv.config();
const app = express();

app.use('/api/stats.svg', statsRoute);
app.use('/api/streak.svg', streakRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
