import { Pool, PoolClient, PoolConfig } from 'pg';
export { PoolConfig } from 'pg';
import { SQL, SQLStatement } from 'sql-template-strings';

export class PoolAdapter {
  private pool: Pool;

  public constructor(config: PoolConfig) {
    this.pool = new Pool(config);
  }

  public async connect(): Promise<PoolClient> {
    return this.pool.connect();
  }

  public async query(aa: SQLStatement): Promise<any> {
    const client = await this.pool.connect();

    try {
      const result = await client.query(aa);

      return result.rows;
    } finally {
      client.release();
    }
  }
}

export const sql = SQL;
