FROM openjdk:17-jdk-slim

WORKDIR /app

# 権限設定（元の設定を保持）
ARG UID=1000
ARG GID=1000
ARG USERNAME=appuser

RUN if ! grep -q "^[^:]*:[^:]*:${GID}:" /etc/group; then \
        addgroup --gid ${GID} --system ${USERNAME}; \
    fi && \
    if ! grep -q "^[^:]*:[^:]*:${UID}:" /etc/passwd; then \
        adduser --uid ${UID} --system --ingroup ${USERNAME} --home /home/${USERNAME} --disabled-password --shell /bin/bash ${USERNAME}; \
    fi && \
    chown ${UID}:${GID} /home/${USERNAME}

# 必要なファイルのみコピー
COPY --chown=${UID}:${GID} gradlew .
COPY --chown=${UID}:${GID} gradle gradle
COPY --chown=${UID}:${GID} build.gradle .
COPY --chown=${UID}:${GID} settings.gradle .
COPY --chown=${UID}:${GID} src src

RUN chmod +x gradlew && \
    chown -R ${UID}:${GID} /app

USER ${UID}:${GID}

# 依存関係のみ事前ダウンロード
RUN ./gradlew dependencies --no-daemon

EXPOSE 3004