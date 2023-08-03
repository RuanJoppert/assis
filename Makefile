include .env.example

dev: migrate-up 
	@ docker compose up -d app

test-unit:
	@ docker-compose run --rm app npm run test:unit

test-integration:
	@ echo "Deleting database"
	@ docker compose -f docker-compose.yml -f docker-compose.test.yml rm -svf db-test
	@ echo "Running migration"
	@ docker compose -f docker-compose.yml -f docker-compose.test.yml run \
		--rm db-migrate-test -path ./migrations -database '$(DB_URL_TEST)?sslmode=disable' up
	@ echo "Running tests"
	@ docker compose run --rm app npm run test:integration

test-e2e:
	@ echo "Deleting database"
	@ docker compose -f docker-compose.yml -f docker-compose.test.yml rm -svf db-test
	@ echo "Running migration"
	@ docker compose -f docker-compose.yml -f docker-compose.test.yml run \
		--rm db-migrate-test -path ./migrations -database '$(DB_URL_TEST)?sslmode=disable' up
	@ echo "Running tests"
	@ docker compose run --rm app npm run test:e2e

migrate-create:
	@ read -p "Please provide a name for the migration: " name; \
	docker compose run --rm db-migrate create -ext sql -dir '$(DB_MIGRATIONS_PATH)' $$name

migrate-up:
	@ docker compose run --rm db-migrate -path ./migrations -database '$(DB_URL)?sslmode=disable' up

psql:
	@ docker compose exec db psql -U $(DB_USER) -d $(DB_NAME)