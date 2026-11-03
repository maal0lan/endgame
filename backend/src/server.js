import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'ironnest-api' });
});

app.listen(port, () => {
  console.log(`IronNest API listening on http://localhost:${port}`);
});
