import { Account, AccountState } from './account.entity';
import {
  AccountInvalidException,
  TransferInsufficientFunds,
  TransferInvalidDestinationException,
} from './account.exceptions';
import { AmountException } from './amount/amount.exceptions';
import { Amount } from './amount/amount.value-object';

describe('Entity: Account', () => {
  describe('Create', () => {
    it('should create an account with zero balance', () => {
      const account = Account.create('1');

      expect(account).toBeInstanceOf(Account);
      expect(account.id).toBe('1');
      expect(account.balance).toBe(0);
    });

    it('when account id is not provided, should throw an error', () => {
      const id = undefined;

      expect.assertions(2);

      try {
        Account.create(id);
      } catch (error) {
        expect(error).toBeInstanceOf(AccountInvalidException);
        expect(error.message).toBe('Account ID must be defined');
      }
    });
  });

  describe('Restore', () => {
    it('should restore an account from a state', () => {
      const state = {
        balance: Amount.from(100),
        transactions: {
          deposit: 1,
          transfer: 0,
        },
      };

      const account = Account.restore('1', state);

      expect(account).toBeInstanceOf(Account);
      expect(account.id).toBe('1');
      expect(account.balance).toBe(100);
    });

    it('when inital state is not provided, should throw an error', () => {
      const state = undefined as unknown as AccountState;

      expect.assertions(2);

      try {
        Account.restore('1', state);
      } catch (error) {
        expect(error).toBeInstanceOf(AccountInvalidException);
        expect(error.message).toBe('Account state must be defined');
      }
    });
  });

  describe('Get balance', () => {
    it('when account is new, should return balance 0', () => {
      const account = Account.create('1');

      expect(account.balance).toBe(0);
    });

    it('when account is restored, should return balance', () => {
      const state = {
        balance: Amount.from(100),
        transactions: {
          deposit: 1,
          transfer: 0,
        },
      };

      const account = Account.restore('1', state);

      expect(account.balance).toBe(100);
    });
  });

  describe('Deposit', () => {
    it('when amount is greater than zero, should deposit an amount', () => {
      const account = Account.create('1');

      account.deposit(100);
      account.deposit(100);

      expect(account.balance).toBe(200);
      expect(account.depositCount).toBe(2);
    });

    it('when amount is zero, should throw an error', () => {
      const account = Account.create('1');

      expect.assertions(2);

      try {
        account.deposit(0);
      } catch (error) {
        expect(error).toBeInstanceOf(AmountException);
        expect(error.message).toBe('Amount must be greater than zero');
      }
    });

    it('when amount is negative, should throw an error', () => {
      const account = Account.create('1');

      expect.assertions(2);

      try {
        account.deposit(-100);
      } catch (error) {
        expect(error).toBeInstanceOf(AmountException);
        expect(error.message).toBe('Amount must be greater than zero');
      }
    });

    describe('Given an restored account', () => {
      it('when amount is greater than zero, should deposit an amount', () => {
        const state = {
          balance: Amount.from(100),
          transactions: {
            deposit: 1,
            transfer: 0,
          },
        };

        const account = Account.restore('1', state);

        account.deposit(100);

        expect(account.balance).toBe(200);
        expect(account.depositCount).toBe(2);
      });
    });
  });

  describe('Transfer', () => {
    it('when amount is zero, should throw an error', () => {
      const account = Account.create('1');
      const destination = Account.create('2');

      expect.assertions(2);

      try {
        account.transfer(0, destination);
      } catch (error) {
        expect(error).toBeInstanceOf(AmountException);
        expect(error.message).toBe('Amount must be greater than zero');
      }
    });

    it('when amount is negative, should throw an error', () => {
      const account = Account.create('1');
      const destination = Account.create('2');

      expect.assertions(2);

      try {
        account.transfer(-100, destination);
      } catch (error) {
        expect(error).toBeInstanceOf(AmountException);
        expect(error.message).toBe('Amount must be greater than zero');
      }
    });

    describe('Given an restored account', () => {
      it('when balance is sufficient, should transfer funds', () => {
        const account = Account.restore('1', {
          balance: Amount.from(100),
          transactions: {
            deposit: 1,
            transfer: 0,
          },
        });
        const destination = Account.create('2');

        account.transfer(100, destination);

        expect(account.balance).toBe(0);
        expect(destination.balance).toBe(100);
        expect(account.transferCount).toBe(1);
        expect(destination.transferCount).toBe(1);
      });

      it('when balance is insufficient, should throw an error', () => {
        const account = Account.restore('1', {
          balance: Amount.from(100),
          transactions: {
            deposit: 1,
            transfer: 0,
          },
        });
        const destination = Account.create('2');

        expect.assertions(2);

        try {
          account.transfer(200, destination);
        } catch (error) {
          expect(error).toBeInstanceOf(TransferInsufficientFunds);
          expect(error.message).toBe('Insufficient funds');
        }
      });

      it('when destination is the same account, should throw an error', () => {
        const account = Account.restore('1', {
          balance: Amount.from(100),
          transactions: {
            deposit: 1,
            transfer: 0,
          },
        });

        expect.assertions(2);

        try {
          account.transfer(100, account);
        } catch (error) {
          expect(error).toBeInstanceOf(TransferInvalidDestinationException);
          expect(error).toMatchObject({
            code: 'TRANSFER.INVALID_DESTINATION',
          });
        }
      });
    });
  });
});
