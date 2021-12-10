import { AccountModel } from '../models';
import { ROLE_MAP } from '../common/role.map';

export class AccountService {
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
}
