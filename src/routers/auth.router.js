import { Router } from 'express';
import { AccountService } from '../services';

export const authRouter = Router();

authRouter.get('/logins/line/url', (req, res) => {
  const url = AccountService.getLoginByLineUrl();
  res.send({ url });
});

authRouter.get('/logins/line/callback', async (req, res) => {
  console.log(`POST /logins/line/callback, body:`, req.query);
});

authRouter.post('/logins/line', async (req, res) => {
  console.log(`POST /logins/line, body:`, req.body);

  try {
    const account = await AccountService.loginByLine(req.body);
    res.json(account);
  } catch (e) {
    res.sendStatus(403);
  }
});
