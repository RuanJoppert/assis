# Banking API

This api was developed as a technical test for a job interview

Hope you enjoy it

## Setup
To see the API working, follow the steps below:

Initialize the app and database
```bash
$ make dev
```

## API

### Create an account
Create a new account with a unique account number.

**Request**
```http
POST /accounts
```

#### Body Parameters
| Parameter        | Type     | Requirement  | Description           |
| :--------------- | :------- | :----------- | --------------------- |
| `account_number` | `string` | **Required** | Unique account number |


#### Response

| Http code | Description                  | Schema                          |
| :-------- | :--------------------------- | ------------------------------- |
| `201`     | Account created successfully | No Content                      |
| `400`     | Bad Request                  | `RequestInvalidException`       |
| `409`     | Account already exists       | `AccountAlreadyExistsException` |

#### Example Request
```shell
curl --request POST \
  --url 'http://localhost:3000/accounts' \
  --header 'Content-Type: application/json' \
  --data '{ "account_number": "123" }'
```

### Make a peer-to-peer transfer
Make a peer-to-peer transfer between two existing accounts.

**Request**
```http
POST /accounts/transfer
```

#### Body Parameters
| Parameter | Type     | Requirement  | Description         |
| :-------- | :------- | :----------- | ------------------- |
| `amount`  | `number` | **Required** | The amount in cents |
| `from`    | `string` | **Required** | Origin account      |
| `to`      | `string` | **Required** | Destination account |


#### Response

| Http code | Description                   | Schema                                |
| :-------- | :---------------------------- | ------------------------------------- |
| `200`     | Transfer made successfully    | No Content                            |
| `400`     | Bad Request                   | `RequestInvalidException`             |
| `409`     | Insufficient balance          | `TransferInsufficientFunds`           |
| `404`     | Destination account not found | `TransferInvalidDestinationException` |
| `404`     | Origin account not found      | `AccountNotFoundException`            |

#### Example Request
```shell
curl --request POST \
  --url http://localhost:3000/accounts/transfer \
  --header 'Content-Type: application/json' \
  --data '{ "from": "123", "to": "456", "amount": 100 }'
```

### Get account balance
Get the current balance of an account.

**Request**
```http
GET /accounts/:accountNumber/balance
```

#### Path Parameters
| Parameter       | Type     | Requirement  | Description         |
| :-------------- | :------- | :----------- | ------------------- |
| `accountNumber` | string   | **Required** | The account id      |


#### Response

| Http code | Description          | Schema                     |
| :-------- | :------------------- | -------------------------- |
| `200`     | Successful operation | No Content                 |
| `400`     | Bad Request          | `RequestInvalidException`  |
| `404`     | Account not found    | `AccountNotFoundException` |

#### Example Request
```shell
curl --request GET \
  --url http://localhost:3000/accounts/123/balance
```

### Deposit into an account
Deposit funds into an existing account.

**Request**
```http
POST /accounts/:accountNumber/deposit
```

#### Path Parameters
| Parameter       | Type     | Requirement  | Description         |
| :-------------- | :------- | :----------- | ------------------- |
| `accountNumber` | string   | **Required** | The account id      |

#### Body Parameters
| Parameter | Type     | Requirement  | Description         |
| :-------- | :------- | :----------- | ------------------- |
| `amount`  | `number` | **Required** | The amount in cents |


#### Response

| Http code | Description               | Schema                     |
| :-------- | :------------------------ | -------------------------- |
| `200`     | Deposit made successfully | No Content                 |
| `400`     | Bad Request               | `RequestInvalidException`  |
| `404`     | Account not found         | `AccountNotFoundException` |

#### Example Request
```shell
curl --request POST \
  --url http://localhost:3000/accounts/123/deposit \
  --header 'Content-Type: application/json' \
  --data '{ "amount": 1000 }'
```

## Test

```bash
# Run unit tests
$ make test-unit

# Run integration tests
$ make test-integration

# Run e2e tests
$ make test-e2e
```
