from flask import Blueprint, json, request, jsonify, current_app
from ocr.processor import run_ocr
from ocr.opencv_handler import pil_to_cv2
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
    # リクエスト処理
    image, error = get_upload_image()

    if error:
        return jsonify({"success": False, "error": error}), 400

    try:
        regions_json = request.form.get('regions')
        if not regions_json:
            return jsonify({"success": False, "error": "regionsパラメータが指定されていません"}), 400
            
        regions = json.loads(regions_json)
    except json.JSONDecodeError:
        return jsonify({"success": False, "error": "regionsのJSON形式が不正です"}), 400

    # OCR言語設定 (デフォルト:日本語+英語)
    ocr_lang = request.form.get('lang', 'jpn')

    try:
        # OpenCV形式に変換
        cv_image = pil_to_cv2(image)
    except Exception as e:
        return jsonify({"success": False, "error": f"画像の変換中にエラーが発生しました: {str(e)}"}), 500

    results = {}
    for region in regions:
        label = region.get("label", "unknown")

        x = int(round(region["x"]))
        y = int(round(region["y"]))
        w = int(round(region["width"]))
        h = int(round(region["height"]))

        try:
            # トリミング
            cropped = cv_image[y:y+h, x:x+w] 

            # テキスト抽出
            extracted_text = run_ocr(cropped, lang=ocr_lang)
            results[label] = extracted_text

            current_app.logger.debug(f"extracted_text: {extracted_text}")
        except Exception as e:
            return jsonify({
                "success": False, 
                "message": f"領域 '{label}' のOCR処理中にエラーが発生しました: {str(e)}"
            }), 500

    current_app.logger.debug(f"success extracted text: {results}")
    return jsonify({
        "success": True,
        "data": results,
        "message": "テキスト抽出が完了しました"
    }), 200