up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs

logs-auth:
	docker compose logs auth-service

logs-user:
	docker compose logs user-service

logs-gateway:
	docker compose logs api-gateway