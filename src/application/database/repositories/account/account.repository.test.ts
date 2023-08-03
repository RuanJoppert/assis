import { getConnectionPool } from '@tests/jest.setup.integration';
import { AccountRepository } from './account.repository';
import { Account } from '@modules/account/account.entity';
import { cleanupDatabase, wait } from '@tests/utils';
import { PoolAdapter, sql } from '@providers/database/pg.adapter';

describe('AccountRepository', () => {
  let repository: AccountRepository;
  let pool: PoolAdapter;

  beforeAll(() => {
    pool = getConnectionPool();
    repository = new AccountRepository(pool);
  });

  beforeEach(async () => {
    await cleanupDatabase(pool);
  });

  afterAll(async () => {
    // await cleanupDatabase(pool);
  });

  describe('Create', () => {
    it('when account does not exists, should create a new account', async () => {
      const account = Account.create('1234');

      await repository.createAccount(account);

      const [{ id, balance, last_transaction_id }] = await pool.query(
        sql`SELECT * FROM accounts WHERE id = ${account.id}`,
      );

      expect(id).toEqual(account.id);
      expect(Number(balance)).toEqual(account.balance);
      expect(last_transaction_id).toEqual(null);
    });
  });

  describe('findByAccountID', () => {
    it('when account does not exists, should throw an error', async () => {
      await expect(repository.findByAccountID('1234')).rejects.toThrow(
        'Account not found',
      );
    });

    it('when account exists, should return the account', async () => {
      const account = Account.create('1234');

      await repository.createAccount(account);

      const result = await repository.findByAccountID(account.id);

      expect(result.id).toEqual(account.id);
      expect(Number(result.balance)).toEqual(account.balance);
    });
  });

  describe('findByAccountIDForUpdate', () => {
    it('when account does not exists, should throw an error', async () => {
      expect.assertions(1);

      try {
        await repository.findByAccountIDForUpdate('1234');
      } catch (error) {
        expect(error.message).toEqual('Account not found');
      }
    });

    it('when account exists, should return the account', async () => {
      const account = Account.create('1234');

      await repository.createAccount(account);

      const result = await repository.findByAccountIDForUpdate(account.id);

      expect(result.id).toEqual(account.id);
      expect(Number(result.balance)).toEqual(account.balance);

      await repository.cancelAccountUpdate(account.id);
    });
  });

  describe('updateAccount', () => {
    it('when account does not exists, should throw an error', async () => {
      const account = Account.create('1234');

      expect.assertions(1);

      try {
        await repository.updateAccount(account);
      } catch (error) {
        expect(error.message).toEqual('Account not found');
      }
    });

    it('when account exists, should update the account', async () => {
      await repository.createAccount(Account.create('1234'));

      const account = await repository.findByAccountIDForUpdate('1234');

      account.deposit(100);
      account.deposit(100);

      await repository.updateAccount(account);

      await wait(10);

      const [{ id, balance, last_transaction_id }] = await pool.query(
        sql`SELECT * FROM accounts WHERE id = ${account.id}`,
      );

      expect(id).toEqual(account.id);
      expect(+balance).toEqual(200);
      expect(last_transaction_id).toBeDefined();
    });
  });
});
