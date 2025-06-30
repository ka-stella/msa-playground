import os
import pytesseract
from PIL import Image

def extract_text(image: Image.Image, lang: str = 'jpn+eng') -> (str | None):
    """
    PIL Imageオブジェクトに対してOCRを実行し、抽出されたテキストを返す。

    Args:
        image: テキスト抽出対象の画像（PIL.Imageオブジェクト）
        lang: 使用する言語コード
    
    Returns:
        str: 抽出されたテキスト(成功)
        None: テキスト抽出(失敗)
    """
    try:
        text = pytesseract.image_to_string(image, lang=lang)
        return text.strip()
    except Exception as e:
        print(f"OCR 処理中にエラー:{e}")
        return None
