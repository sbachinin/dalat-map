import os
from PIL import Image
from heic_converter import convert_heic_to_jpg

# if not installed, pip install Pillow

orig_other_folder = 'dalat-map-images/orig-other'
orig_highlights_folder = 'dalat-map-images/orig-highlights'
thumbs_folder = 'dalat-map-images/thumbs'
large_folder = 'dalat-map-images/large'

def resize_from_folder(source_folder):
    
    for root, dirs, files in os.walk(source_folder):
        for file in files:
            if file.endswith(":Zone.Identifier"):
                file_path = os.path.join(root, file)
                os.remove(file_path)
    
    for filename in os.listdir(source_folder):
        
        if filename.lower().endswith('.heic'):
            heic_file_path = os.path.join(source_folder, filename)
            filename_without_extension, _ = os.path.splitext(filename)
            jpg_filename = filename_without_extension + '.jpg'
            jpg_file_path = os.path.join(source_folder, jpg_filename)
            convert_heic_to_jpg(heic_file_path, jpg_file_path)
            filename = jpg_filename
        
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            
            thumb_path = os.path.join(thumbs_folder, filename)
            large_path = os.path.join(large_folder, filename)

            source_img_path = os.path.join(source_folder, filename)
            with Image.open(source_img_path) as img:
                
                # 1. thumb
                if not os.path.exists(thumb_path):
                    width_percent = (215 / float(img.size[0]))
                    new_height = int((float(img.size[1]) * float(width_percent)))
                    img1 = img.resize((215, new_height), Image.LANCZOS)
                    img1.save(thumb_path, quality=95)

                # 2. big
                if not os.path.exists(large_path):
                    width_percent = (800 / float(img.size[0]))
                    new_height = int((float(img.size[1]) * float(width_percent)))
                    img2 = img.resize((800, new_height), Image.LANCZOS)
                    img2.save(large_path, quality=95)

resize_from_folder(orig_highlights_folder)
resize_from_folder(orig_other_folder)

print("Images have been resized")
