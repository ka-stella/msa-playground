import cv2
import numpy as np

def preprocess_image(cv_image, denoise_strength=10, adaptive_thresh=True):
    """
    画像前処理パイプライン

    Args:
        cv_image: OpenCV画像（BGR）
        denoise_strength: ノイズ除去強度（1-30）
        adaptive_thresh: 適応的二値化を使うか

    Returns:
        np.ndarray: 前処理済み画像
    """
    try :
        # グレースケール
        gray = auto_invert(cv_image)

        # ノイズ除去
        denoised = cv2.fastNlMeansDenoising(
            gray,
            h=denoise_strength,
            templateWindowSize=7,
            searchWindowSize=21
        )

        # 二値化
        if adaptive_thresh:
            binary = cv2.adaptiveThreshold(
                denoised, 255,
                cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                cv2.THRESH_BINARY_INV, 11, 2
            )
        else:
            _, テキスト抽出 = cv2.threshold(
                denoised, 0, 255,
                cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
            )

        # 輪郭強調
        kernel = np.ones((2,2), np.uint8)
        processed = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)

        return processed
    except Exception as e:
        print(f"前処理エラー:{e}")
        return None
    
def auto_invert(cv_image):
    """
    画像の明暗分布から自動反転判定（背景黒、文字白に対応するため）
    """
    gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY) if len(cv_image.shape) == 3 else cv_image
    
    # 画素値の中央値で判定（閾値は調整可能）
    median = np.median(gray)
    if median < 127:  # 全体が暗い場合
        return cv2.bitwise_not(gray)
    return gray

def pil_to_cv2(pil_image):
    """
    Pillow画像をOpenCV（NumPy配列、BGR形式）に変換する

    Args:
        pil_image: PillowのImageオブジェクト

    Returns:
        np.ndarray: OpenCV（BGR）形式の画像
    """
    try :
        if pil_image.mode != 'RGB':
            pil_image = pil_image.convert('RGB')

        # NumPy配列に変換
        np_image = np.array(pil_image)

        # RGB→BGR（OpenCV形式）
        cv_image = cv2.cvtColor(np_image, cv2.COLOR_RGB2BGR)
        return cv_image
    except Exception as e:
        print(f"Pillow → OpenCV形式の画像へ変換処理中にエラー:{e}")
        return None