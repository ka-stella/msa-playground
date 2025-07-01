from PIL import Image
from .opencv_handler import preprocess_image
from .tesseract_handler import extract_text_from_image

def run_ocr(image, lang = 'jpn+eng') -> (str | None):
    """
    OpenCV形式の画像に対してOCRを実行し、抽出されたテキストを返す。

    Args:
        image: OpenCV形式の画像（NumPy配列）
        lang: 使用する言語コード
    
    Returns:
        str: 抽出されたテキスト(成功)
        None: テキスト抽出(失敗)
    """
    try:
        # 前処理
        processed = preprocess_image(image)

        # テキスト抽出
        text = extract_text_from_image(processed, lang=lang)
        return text.strip()
    except Exception as e:
        print(f"OCR 処理中にエラー:{e}")
        return None