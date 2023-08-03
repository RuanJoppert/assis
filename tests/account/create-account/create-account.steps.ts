import { getConnectionPool, getTestApp } from '@tests/jest.setup.integration';
import { defineFeature, loadFeature } from 'jest-cucumber';
import * as request from 'supertest';
import { Express } from 'express';
import { PoolAdapter, sql } from '@providers/database/pg.adapter';
import { cleanupDatabase } from '@tests/utils';

const feature = loadFeature(
  'tests/account/create-account/create-account.feature',
);

defineFeature(feature, (test) => {
  let pool: PoolAdapter;
  let app: Express;

  beforeAll(async () => {
    pool = getConnectionPool();
    app = getTestApp();
  });

  afterEach(async () => {
    await cleanupDatabase(pool);
  });

  test('Create a new account', ({ given, when, then }) => {
    let account_number: string;

    given(/^a valid account number "(.*)"$/, (arg0) => {
      account_number = arg0;
    });

    when('I create an account', async () => {
      await request(app)
        .post('/accounts')
        .send({ account_number })
        .set('Accept', 'application/json')
        .expect(201);
    });

    then('the account should be created', async () => {
      const [{ id, balance, last_transaction_id }] = await pool.query(
        sql`SELECT * FROM accounts WHERE id = ${account_number}`,
      );

      expect(id).toEqual(account_number);
      expect(Number(balance)).toEqual(0);
      expect(last_transaction_id).toEqual(null);
    });
  });

  test('Create an account with an invalid account number', ({
    given,
    when,
    then,
  }) => {
    let account_number: string;

    given(/^an (.*) account number "invalid"$/, (arg0) => {
      account_number = arg0;
    });

    let response: request.Response;

    when('I create an account', async () => {
      response = await request(app)
        .post('/accounts')
        .send({ account_number })
        .set('Accept', 'application/json')
        .expect(400);
    });

    then('the account should not be created', async () => {
      const [{ exists }] = await pool.query(
        sql`SELECT EXISTS (SELECT 1 FROM accounts WHERE id = ${account_number});`,
      );

      expect(exists).toEqual(false);

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        error: {
          code: 'BAD_REQUEST',
          message: 'Account number must be a string with numbers only',
        },
      });
    });
  });

  test('Account already exists', ({ given, when, then }) => {
    let account_number: string;

    given(/^an existing account number "(.*)"$/, async (arg0) => {
      account_number = arg0;

      await request(app)
        .post('/accounts')
        .send({ account_number })
        .set('Accept', 'application/json')
        .expect(201);
    });

    let response: request.Response;

    when('I create an account with the same account number', async () => {
      response = await request(app)
        .post('/accounts')
        .send({ account_number })
        .set('Accept', 'application/json')
        .expect(409);
    });

    then('the account should not be created', () => {
      expect(response.statusCode).toEqual(409);
      expect(response.body).toEqual({
        error: {
          code: 'ACCOUNT.ALREADY_EXISTS',
          message: 'Account already exists',
        },
      });
    });
  });
});
