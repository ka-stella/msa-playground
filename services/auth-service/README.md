# コンテナ起動停止

```bash
# イメージビルド
docker build -t auth-service-image .
# コンテナ起動
docker run -p 3001:3001 --name auth-service-container auth-service-image
# コンテナ停止
docker stop auth-service-container
```
