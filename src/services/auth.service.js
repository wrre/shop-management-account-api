import querystring from 'querystring';
import axios from 'axios';
import * as fs from 'fs';
import jwt from 'jsonwebtoken';
import { AccountModel } from '../models';
import { ROLE_MAP } from '../common/role.map';

const {
  CLIENT_ID,
  REDIRECT_URI,
  RESPONSE_TYPE,
  SCOPE,
  CLIENT_SECRET,
  JWT_PRIVATE_KEY_PATH,
} = process.env;

const state = 'shop-management';
const nonce = '09876xyz';

const jwtPrivateKey = fs.readFileSync(JWT_PRIVATE_KEY_PATH);

export class AuthService {
  static getLoginByLineUrl() {
    const query = querystring.stringify({
      response_type: RESPONSE_TYPE,
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      state,
      scope: SCOPE,
      nonce,
    });
    return `https://access.line.me/oauth2/v2.1/authorize?${query}`;
  }

  static async findOrCreateAccount(data) {
    const { name, ...login } = data;
    let account = await AccountModel.findOne({
      where: { ...login },
      raw: true,
    });

    if (!account) {
      account = await AccountModel.create({
        name,
        role: ROLE_MAP.NORMAL,
        ...login,
      });
    }

    return account;
  }

  static async loginByLine(data) {
    const { code, state } = data;

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
      .then((response) => response.data)
      .catch((e) => {
        console.log('[ERROR] loginByLine verify code error', e.response.data);

        throw e.data;
      });

    const verifyTokenResponse = await axios
      .post(
        'https://api.line.me/oauth2/v2.1/verify',
        querystring.stringify({
          id_token: verifyCodeResponse.id_token,
          client_id: CLIENT_ID,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      )
      .then((response) => response.data)
      .catch((e) => {
        console.error(
          '[ERROR] loginByLine verify token error',
          e.response.data,
        );

        throw e.data;
      });

    const { sub: lineThirdPartyId, name } = verifyTokenResponse;

    const account = await this.findOrCreateAccount({
      name,
      lineThirdPartyId,
    });

    console.log(
      `loginByLine, id: ${account.id}, name: ${name}, lineThirdPartyId: ${lineThirdPartyId}`,
    );

    const token = jwt.sign({ id: account.id }, jwtPrivateKey, {
      algorithm: 'RS256',
    });

    return { token, account };
  }
}
