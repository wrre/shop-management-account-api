import { Router } from 'express';
import { AccountService } from '../services';

export const accountRouter = Router();

accountRouter.get('/authorized/account-ids', async (req, res) => {
  const accountId = req.user.id;
  const accountIds = await AccountService.findAuthorizedAccountIds(accountId);
  res.json({ accountIds });
});

accountRouter.get('/me', async (req, res) => {
  const accountId = req.user.id;
  try {
    const account = await AccountService.findAccountById(accountId);
    res.json(account);
  } catch (e) {
    res.sendStatus(403);
  }
});
