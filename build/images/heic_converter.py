# heic_converter.py
import pyheif
from PIL import Image

def convert_heic_to_jpg(heic_path, jpg_path):
    heif_file = pyheif.read(heic_path)
    
    # Convert to a Pillow Image
    image = Image.frombytes(
        heif_file.mode, 
        heif_file.size, 
        heif_file.data, 
        "raw", 
        heif_file.mode, 
        heif_file.stride,
    )
    
    # Save the image as JPG
    image.save(jpg_path, "JPEG", quality=100)
