import os
from PIL import Image
from heic_converter import convert_heic_to_jpg

# HOW TO RUN THIS
# in project root, "source myenv/bin/activate"
# python chores/resize_all_images.py

orig_other_folder = 'dalat-map-images/orig-other'
orig_highlights_folder = 'dalat-map-images/orig-highlights'
thumbs_folder = 'dalat-map-images/thumbs'
large_folder = 'dalat-map-images/large'

os.makedirs(thumbs_folder, exist_ok=True)

for filename in os.listdir(thumbs_folder):
    file_path = os.path.join(thumbs_folder, filename)
    if os.path.isfile(file_path):
        os.remove(file_path)

for filename in os.listdir(large_folder):
    file_path = os.path.join(large_folder, filename)
    if os.path.isfile(file_path):
        os.remove(file_path)



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
            img_path = os.path.join(source_folder, filename)
            with Image.open(img_path) as img:
                
                # !has to be done in resize_new... too
                if img.width > img.height:
                    img = img.rotate(-90, expand=True)
                
                # 1. thumb

                width_percent = (215 / float(img.size[0]))
                new_height = int((float(img.size[1]) * float(width_percent)))
                img1 = img.resize((215, new_height), Image.LANCZOS)
                optimized_img_path = os.path.join(thumbs_folder, filename)
                img1.save(optimized_img_path, quality=95)

                # 2. big

                width_percent = (800 / float(img.size[0]))
                new_height = int((float(img.size[1]) * float(width_percent)))
                img2 = img.resize((800, new_height), Image.LANCZOS)
                large_img_path = os.path.join(large_folder, filename)
                img2.save(large_img_path, quality=95)

resize_from_folder(orig_highlights_folder)
resize_from_folder(orig_other_folder)

print("Images have been resized")
