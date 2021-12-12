import { Router } from 'express';
import { AuthService } from '../services';

export const authRouter = Router();

authRouter.get('/logins/line/url', (req, res) => {
  const { redirectUri } = req.query;
  const url = AuthService.getLoginByLineUrl(redirectUri);
  res.send({ url });
});

// for test
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

authRouter.get('/logins/facebook/url', (req, res) => {
  const { redirectUri } = req.query;
  const url = AuthService.getLoginByFacebookUrl(redirectUri);
  res.send({ url });
});

// for test
authRouter.get('/logins/facebook/callback', async (req, res) => {
  res.end();
});

authRouter.post('/logins/facebook', async (req, res) => {
  try {
    const account = await AuthService.loginByFacebook(req.body);
    res.json(account);
  } catch (e) {
    res.sendStatus(403);
  }
});
