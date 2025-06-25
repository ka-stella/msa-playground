import os
from flask import Flask, request, jsonify
from PIL import Image
import pytesseract
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

@app.route('/health')
def health_check():
    return "起動OK", 200

# ルート ('/') にアクセスしたときの処理を定義
@app.route('/')
def hello_world():
    return 'Hello'

# アプリケーションを起動
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 3003))
    debug_str = os.environ.get("DEBUG", "False").lower()
    debug_mode = (debug_str == 'true' or debug_str == '1')

    app.run(host='0.0.0.0', port=port, debug=debug_mode)