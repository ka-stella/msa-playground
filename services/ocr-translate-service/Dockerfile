FROM python:3.9-slim-buster

# tesseract-ocr: Tesseract本体
# tesseract-ocr-jpn: 日本語言語データ
# libtesseract-dev: Tesseract開発ライブラリ (pytesseractのビルドに必要)
# libleptonica-dev: Leptonica開発ライブラリ (Tesseractの依存)
# poppler-utils: PDF,画像抽出などに使われる
# fontconfig: フォント設定関連
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-jpn \
    libtesseract-dev \
    libleptonica-dev \
    poppler-utils \
    fontconfig \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Pythonの依存関係をインストール
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ARG UID=1000
ARG GID=1000

# UID・GID1000のユーザが存在しなければ作成
RUN if ! grep -q "^[^:]*:[^:]*:${GID}:" /etc/group; then \
      addgroup --gid ${GID} --system appuser; \
    fi

RUN if ! grep -q "^[^:]*:[^:]*:${UID}:" /etc/passwd; then \
      adduser --uid ${UID} --system --ingroup appuser --no-create-home --disabled-password appuser; \
    fi


RUN chown -R ${UID}:${GID} /app

USER ${UID}:${GID}

EXPOSE 3003