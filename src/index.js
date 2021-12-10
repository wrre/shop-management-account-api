// eslint-disable-next-line import/newline-after-import
import './set-env';
import './models';

import express from 'express';
import { authRouter } from './routers';

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl, req.body);
  next();
});

app.get('/health', (req, res) => {
  res.send('ok');
});

app.use('/auth', authRouter);

app.listen(process.env.SERVICE_API_PORT);
