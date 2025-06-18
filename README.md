# バックエンド起動
```
$ cd [project root]
$ docker compose up -d
```
## Swagger UI
- [Auth Service](http://localhost:8000/auth/api-docs/)
- [User Service](http://localhost:8000/users/api-docs/)

# フロントエンド起動
```
$ cd frontend
$ npm run serve
```
http://localhost:8080/


# マイグレーション
```
$ docker compose exec auth-service npx prisma migrate dev
$ docker compose exec auth-service npx prisma generate
```