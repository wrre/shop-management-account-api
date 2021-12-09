import { Router } from 'express';
import * as querystring from 'querystring';
import axios from 'axios';

export const authRouter = Router();

const { CLIENT_ID, REDIRECT_URI, RESPONSE_TYPE, SCOPE, CLIENT_SECRET } =
  process.env;

const state = 'shop-management';
const nonce = '09876xyz';

authRouter.get('/logins/line/url', (req, res) => {
  const query = querystring.stringify({
    response_type: RESPONSE_TYPE,
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    state,
    scope: SCOPE,
    nonce,
  });
  res.send({ url: `https://access.line.me/oauth2/v2.1/authorize?${query}` });
});

authRouter.get('/logins/line/callback', async (req, res) => {
  console.log(`POST /logins/line/callback, body:`, req.query);
});

authRouter.post('/logins/line', async (req, res) => {
  console.log(`POST /logins/line, body:`, req.body);

  const { code, state } = req.body;

  const verifyCodeResponse = await axios
    .post(
      'https://api.line.me/oauth2/v2.1/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    )
    .then(({ data }) => data)
    .catch((e) => {
      console.log('[ERROR] login by line verify code error', e.response.data);
      res.sendStatus(403);
    });

  if (!verifyCodeResponse) {
    return;
  }

  const verifyTokenResponse = await axios
    .post(
      'https://api.line.me/oauth2/v2.1/verify',
      querystring.stringify({
        id_token: verifyCodeResponse.id_token,
        client_id: CLIENT_ID,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    )
    .then(({ data }) => data)
    .catch((e) => {
      console.log('[ERROR] login by line verify token error', e.response.data);

      res.sendStatus(500);
    });

  if (!verifyTokenResponse) {
    return;
  }

  const { sub: thirdPartyId, name } = verifyTokenResponse;

  console.log(
    `POST /logins/line, name: ${name}, thirdPartyId: ${thirdPartyId}`,
  );

  res.sendStatus(200);
});
