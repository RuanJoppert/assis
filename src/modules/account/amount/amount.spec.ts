import { AmountException } from './amount.exceptions';
import { Amount } from './amount.value-object';

describe('Value Object: Amount', () => {
  describe('Create', () => {
    it('Should create an amount with zero value', () => {
      const amount = Amount.create();

      expect(amount).toBeInstanceOf(Amount);
      expect(amount.value).toBe(0);
    });
  });

  describe('Restoring', () => {
    it('Should restore an amount with provided value', () => {
      const amount = Amount.from(1000);

      expect(amount).toBeInstanceOf(Amount);
      expect(amount.value).toBe(1000);
    });
  });

  describe('Getters', () => {
    it('When cents is called, then return value in cents', () => {
      const value = 1;
      const amount = Amount.from(value);

      expect(amount.value).toBe(value);
    });

    it('When decimal is called, then return value in decimal', () => {
      const value = 10;
      const amount = Amount.from(value);

      expect(amount.string).toBe('0.10');
    });
  });

  describe('Add', () => {
    it('When amount is greater than zero, then add value', () => {
      const amount = Amount.from(1);
      const value = 1;

      amount.add(value);

      expect(amount.value).toBe(2);
    });

    it('When amount is zero, then throw AmountException', () => {
      const amount = Amount.from(1);
      const value = 0;

      expect.assertions(2);

      try {
        amount.add(value);
      } catch (error) {
        expect(error).toBeInstanceOf(AmountException);
        expect(error.message).toBe('Amount must be greater than zero');
      }
    });

    it('When amount is negative, then throw AmountException', () => {
      const amount = Amount.from(1);
      const value = -1;

      expect.assertions(2);

      try {
        amount.add(value);
      } catch (error) {
        expect(error).toBeInstanceOf(AmountException);
        expect(error.message).toBe('Amount must be greater than zero');
      }
    });
  });

  describe('Subtract', () => {
    it('When amount is greater than zero, then subtract value', () => {
      const amount = Amount.from(2);
      const value = 1;

      amount.subtract(value);

      expect(amount.value).toBe(1);
    });

    it('When amount is zero, then throw AmountException', () => {
      const amount = Amount.from(1);
      const value = 0;

      expect.assertions(2);

      try {
        amount.subtract(value);
      } catch (error) {
        expect(error).toBeInstanceOf(AmountException);
        expect(error.message).toBe('Amount must be greater than zero');
      }
    });

    it('When amount is negative, then throw AmountException', () => {
      const amount = Amount.from(1);
      const value = -1;

      expect.assertions(2);

      try {
        amount.subtract(value);
      } catch (error) {
        expect(error).toBeInstanceOf(AmountException);
        expect(error.message).toBe('Amount must be greater than zero');
      }
    });
  });
});
