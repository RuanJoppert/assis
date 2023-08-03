CREATE TYPE transaction_type AS ENUM (
  'deposit',
  'transfer'
);

CREATE TABLE IF NOT EXISTS transactions (
  id bigserial PRIMARY KEY,
  account_id VARCHAR NOT NULL,
  "type" transaction_type NOT NULL,
  amount BIGINT NOT NULL,
  "to" VARCHAR,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);