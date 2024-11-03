import os
from PIL import Image

# if not installed, pip install Pillow

source_folder = '../dalat-map-images/originals'
thumbs_folder = '../dalat-map-images/thumbs'
large_folder = '../dalat-map-images/large'

os.makedirs(thumbs_folder, exist_ok=True)

for filename in os.listdir(source_folder):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
        img_path = os.path.join(source_folder, filename)
        with Image.open(img_path) as img:
            
            # 1. thumb

            width_percent = (215 / float(img.size[0]))
            new_height = int((float(img.size[1]) * float(width_percent)))
            img = img.resize((215, new_height), Image.LANCZOS)
            optimized_img_path = os.path.join(thumbs_folder, filename)
            img.save(optimized_img_path, quality=95)

            # 2. big

            width_percent = (800 / float(img.size[0]))
            new_height = int((float(img.size[1]) * float(width_percent)))
            img = img.resize((800, new_height), Image.LANCZOS)
            large_img_path = os.path.join(large_folder, filename)
            img.save(large_img_path, quality=95)

print("Images have been resized and saved in the thumbs folder.")
