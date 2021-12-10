// eslint-disable-next-line import/newline-after-import
import './set-env';
import './models';

import express from 'express';
import fs from 'fs';
import jwt from 'express-jwt';
import { accountRouter, authRouter } from './routers';

const { JWT_PUBLIC_KEY_PATH, SERVICE_API_PORT } = process.env;

const jwtPublicKey = fs.readFileSync(JWT_PUBLIC_KEY_PATH);

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl, req.body);
  next();
});
app.use(
  jwt({ secret: jwtPublicKey, algorithms: ['RS256'] }).unless({
    path: ['/health'],
  }),
);
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.sendStatus(403);
  }
});

app.get('/health', (req, res) => {
  res.send('ok');
});

app.use('/auth', authRouter);
app.use('/accounts', accountRouter);

app.listen(SERVICE_API_PORT);
