import { IAccountRepository } from '@modules/account/account.types';
import { Account, TransactionType } from '@modules/account/account.entity';
import {
  AccountAlreadyExistsException,
  AccountNotFoundException,
} from '@modules/account/account.exceptions';
import { Amount } from '@modules/account/amount/amount.value-object';
import { PoolAdapter, sql } from '@providers/database/pg.adapter';
import { PoolClient } from 'pg';

type accountID = string;
type account = Account<accountID>;

export class AccountRepository implements IAccountRepository {
  private connections: Map<string, PoolClient> = new Map();

  public constructor(private pool: PoolAdapter) {}

  public async createAccount(account: account): Promise<void> {
    const [{ exists }] = await this.pool.query(
      sql`SELECT EXISTS (SELECT 1 FROM accounts WHERE id = ${account.id});`,
    );

    if (exists) {
      throw new AccountAlreadyExistsException('Account already exists');
    }

    await this.pool.query(sql`
      INSERT INTO 
        accounts (id, balance) 
        values (${account.id}, ${account.balance});
    `);
  }

  public async findByAccountID(accountID: accountID): Promise<account> {
    const [data] = await this.pool.query(
      sql`
      SELECT 
        a.id,
        a.balance,
        COUNT(CASE WHEN t.type = 'deposit' THEN 1 END) AS deposit_count,
        COUNT(CASE WHEN t.type = 'transfer' THEN 1 END) AS transfer_count
      FROM accounts a
      LEFT JOIN transactions t ON a.id = t.account_id
      WHERE a.id = ${accountID}
      GROUP BY a.id;
      `,
    );

    if (!data) {
      throw new AccountNotFoundException('Account not found');
    }

    return Account.restore(data.id, {
      balance: Amount.from(data.balance),
      transactions: {
        deposit: +data.deposit_count,
        transfer: +data.transfer_count,
      },
    });
  }

  public async findByAccountIDForUpdate(
    accountID: accountID,
  ): Promise<Account<accountID>> {
    const conn = await this.pool.connect();

    conn.query('BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;');

    const res = await conn.query(
      sql`SELECT id, balance FROM accounts WHERE id = ${accountID} FOR UPDATE;`,
    );

    const data = res.rows[0];

    if (!data) {
      conn.query('ROLLBACK;');

      throw new AccountNotFoundException('Account not found');
    }

    this.connections.set(accountID, conn);

    return Account.restore(data.id, {
      balance: Amount.from(data.balance),
      transactions: { deposit: 0, transfer: 0 },
    });
  }

  public async updateAccount(account: account): Promise<void> {
    const conn = await this.getConnection(account.id);

    const [{ exists }] = await this.pool.query(
      sql`SELECT EXISTS (SELECT 1 FROM accounts WHERE id = ${account.id});`,
    );

    if (!exists) {
      throw new AccountNotFoundException('Account not found');
    }

    const { transactions } = account;

    let lastTransactionID;
    for (const transaction of transactions) {
      const to =
        transaction.type === TransactionType.TRANSFER ? transaction.to : null;

      const res = await conn.query(
        sql`
        INSERT INTO 
          transactions (account_id, type, amount, "to") 
          values (${account.id}, ${transaction.type}, ${transaction.amount}, ${to})
        returning id;`,
      );

      const [{ id }] = res.rows;

      lastTransactionID = id;
    }

    await conn.query(
      sql`
      UPDATE accounts 
      SET balance = ${account.balance},
          last_transaction_id = ${lastTransactionID}
      WHERE id = ${account.id};`,
    );

    conn.query('COMMIT;');
    conn.release();

    this.connections.delete(account.id);
  }

  public async cancelAccountUpdate(accountID: accountID): Promise<void> {
    const conn = await this.getConnection(accountID);

    conn.query('ROLLBACK;');
    conn.release();

    this.connections.delete(accountID);
  }

  private saveConnection(conn: any, accountID: accountID) {
    this.connections.set(accountID, conn);
  }

  private async getConnection(accountID: accountID): Promise<PoolClient> {
    const conn = this.connections.get(accountID);

    if (!conn) {
      return this.pool.connect();
    }

    return conn;
  }
}
