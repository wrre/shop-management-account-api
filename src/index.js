// eslint-disable-next-line import/newline-after-import
import './set-env';

import express from 'express';
import { authRouter } from './routers';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.send('ok');
});

app.use('/auth', authRouter);

app.listen(3001);
