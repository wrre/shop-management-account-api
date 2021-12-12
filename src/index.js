// eslint-disable-next-line import/newline-after-import
import './set-env';
import './models';

import express from 'express';
import fs from 'fs';
import jwt from 'express-jwt';
import cors from 'cors';
import https from 'https';
import { accountRouter, authRouter } from './routers';

const {
  NODE_ENV,
  JWT_PUBLIC_KEY_PATH,
  SERVICE_API_PORT,
  SERVICE_API_INTERNAL_PORT,
  SSL_PRIVATE_KEY_PATH,
  SSL_CERTIFICATE_PATH,
} = process.env;

const jwtPublicKey = fs.readFileSync(JWT_PUBLIC_KEY_PATH);

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl, req.body);
  next();
});
app.use(
  jwt({ secret: jwtPublicKey, algorithms: ['RS256'] }).unless({
    path: ['/health', /^\/auth.*/],
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

app.use((req, res, next) => {
  res.sendStatus(404);
});

if (NODE_ENV === 'local') {
  app.listen(SERVICE_API_PORT);
} else {
  const privateKey = fs.readFileSync(SSL_PRIVATE_KEY_PATH);
  const certificate = fs.readFileSync(SSL_CERTIFICATE_PATH);

  const credentials = { key: privateKey, cert: certificate };

  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(SERVICE_API_PORT);
}

app.listen(SERVICE_API_INTERNAL_PORT);
