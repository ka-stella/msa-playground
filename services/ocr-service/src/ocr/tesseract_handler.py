import pytesseract

def extract_text_from_image(cv_image, lang = 'jpn+eng') -> (str | None):
    """
    PIL Imageオブジェクトに対してOCRを実行し、抽出されたテキストを返す。

    Args:
        cv_image: OpenCV（NumPy配列）形式の画像（通常BGR）
        lang: 使用する言語コード
    
    Returns:
        str: 抽出されたテキスト(成功)
        None: テキスト抽出(失敗)
    """ 
    try:
        text = pytesseract.image_to_string(cv_image, lang=lang)
        return text.strip()
    except Exception as e:
        print(f"OCR 処理中にエラー:{e}")
        return None
