from flask import Blueprint, request, jsonify, current_app
from ocr.processor import extract_text
from utils.file_handler import get_upload_image

ocr_bp = Blueprint('ocrx_api', __name__) 

@ocr_bp.route('/health')
def health_check():
    return "起動OK", 200

@ocr_bp.route('/extract', methods=['POST'])
def ocr_image():
    """
    画像を受け取り、OCRを実行してテキストを返す
    """
    image, error = get_upload_image()

    if error:
        return jsonify({"message": error}), 400
    
    # 言語はとりあえず固定
    ocr_lang = 'jpn+eng'

    extracted_text = extract_text(image, lang=ocr_lang)

    if extracted_text is None:
        return jsonify({"message": "OCRが実行できませんでした。画像形式または内容を確認してください。"}), 500
    
    return jsonify({"message": "抽出成功", "extracted_text": extracted_text}), 200