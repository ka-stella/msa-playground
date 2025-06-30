import os
from dotenv import load_dotenv
load_dotenv()
from flask import Flask, jsonify
from config import Config
from route import ocr_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config) #設定を読み込む
    app.register_blueprint(ocr_bp) #Blueprintの登録
    app.json.ensure_ascii = False # 日本語文字化け対応

    return app

app = create_app()