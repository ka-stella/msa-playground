import os
from flask import request , jsonify , current_app
from werkzeug.utils import secure_filename
from PIL import Image

def get_upload_image(file_key='file'):
    """
    アップロードされた画像ファイルを取得し、PILオブジェクトとして返す
        
    Args:
        file_key (str): リクエストで画像ファイルを取得するためのキー名
        
    Returns:
        tuple: (PIL.Image, None) 
                (None, str)
    """
    if file_key not in request.files:
        return None, "リクエストにファイルが含まれていません"

    file = request.files[file_key]
    if file.filename == '':
        return None, "ファイルが選択されていません"
    
    if not file:
        return None, "有効なファイルが選択されませんでした"
    
    #拡張子のチェック
    # allowed_extentions = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'}
    allowed_extentions = {'png', 'jpg', 'jpeg'}
    if '.' not in file.filename or \
    file.filename.rsplit('.',1)[1].lower() not in allowed_extentions:
        return None, "無効なファイル形式です"
    
    try:
        img = Image.open(file.stream)
        current_app.logger.debug(
            f"画像情報: 形式={img.format}, サイズ={img.size}, モード={img.mode}"
        )
        return img, None
    except Exception as e:
        return None, str(e)
