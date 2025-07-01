import os

class Config:
    # 開発環境かどうか
    DEBUG = os.environ.get('DEBUG', 'False') == 'True'

    # アプリケーションのポート
    PORT = int(os.environ.get('PORT', 3003))

    # Tesseract OCRの言語データパス
    TESSDATA_PREFIX = os.environ.get('TESSDATA_PREFIX', '/usr/share/tesseract-ocr/5/tessdata')

    # アップロードファイルの最大サイズ (16MB)
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024

    # サポートするOCR言語
    SUPPORTED_OCR_LANGUAGES = ['eng', 'jpn', 'jpn+eng']