import { Router } from 'express';
import { AuthService } from '../services';

export const authRouter = Router();

authRouter.get('/logins/line/url', (req, res) => {
  const url = AuthService.getLoginByLineUrl();
  res.send({ url });
});

authRouter.get('/logins/line/callback', async (req, res) => {
  res.end();
});

authRouter.post('/logins/line', async (req, res) => {
  try {
    const account = await AuthService.loginByLine(req.body);
    res.json(account);
  } catch (e) {
    res.sendStatus(403);
  }
});
