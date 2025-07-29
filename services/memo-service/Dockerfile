# ベースイメージとしてOpen JDK 17を使用
FROM openjdk:17-jdk-slim

# 作業ディレクトリを設定
WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src

# Gradle Wrapperの実行権限を付与
RUN chmod +x gradlew

# 依存関係をダウンロードしてキャッシュ (ビルド高速化のため)
RUN ./gradlew dependencies --no-daemon

# アプリケーションをビルドし、実行可能なJARファイルを生成
RUN ./gradlew bootJar --no-daemon

# JARファイルを指定して実行
# ARG JAR_FILE=build/libs/memo-service-0.0.1-SNAPSHOT.jar
# ENTRYPOINT ["java", "-jar", ${JAR_FILE}]

EXPOSE 3004