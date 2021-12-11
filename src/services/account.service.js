import { AccountModel } from '../models';
import { ROLE_MAP } from '../common/role.map';

export class AccountService {
  static async findAuthorizedAccountIds(id) {
    const account = await AccountModel.findOne({
      where: { id },
      raw: true,
    });

    switch (true) {
      case account.role === ROLE_MAP.SYSTEM:
        return await AccountModel.findAll({
          attributes: ['id'],
          group: ['id'],
          raw: true,
        }).then((accounts) => accounts.map((account) => account.id));
      case account.role === ROLE_MAP.ORGANIZATION && !!account.organizationId:
        return await AccountModel.findAll({
          where: { organizationId: account.organizationId },
          attributes: ['id'],
          group: ['id'],
          raw: true,
        }).then((accounts) => accounts.map((account) => account.id));
      default:
        return [id];
    }
  }
}
