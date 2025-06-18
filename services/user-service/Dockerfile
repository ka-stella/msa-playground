FROM node:20-alpine

RUN apk add --no-cache curl shadow

WORKDIR /app
COPY package*.json ./
RUN npm install

ARG UID=1000
ARG GID=1000

# UID・GID1000のユーザが存在しなければ作成
RUN if ! grep -q "^[^:]*:[^:]*:${GID}:" /etc/group; then \
      addgroup -g ${GID} -S appuser; \
    fi && \
    if ! grep -q "^[^:]*:[^:]*:${UID}:" /etc/passwd; then \
      adduser -u ${UID} -S -G appuser appuser; \
    fi

USER ${UID}:${GID}

EXPOSE 3002