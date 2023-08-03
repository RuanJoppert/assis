import { PoolAdapter, sql } from '@providers/database/pg.adapter';

/**
 * Cleanup database
 */
export const cleanupDatabase = async (
  pool: PoolAdapter,
  tables = ['accounts', 'transactions'],
) => {
  for (const table of tables) {
    await pool.query(sql`DELETE FROM `.append(table).append(';'));
  }

  const tablesToTruncate = tables.join(', ');

  await pool.query(
    sql`TRUNCATE TABLE `
      .append(tablesToTruncate)
      .append(` RESTART IDENTITY CASCADE;`),
  );
};

/**
 * Wait for a given time
 */
export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
