import argparse
import sys
from PIL import Image
import os
from heic_converter import convert_heic_to_jpg

thumbs_folder = 'dalat-map-images/thumbs'
large_folder = 'dalat-map-images/large'

def process_image(source_folder, filename, force=False):
    if not filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.heic')):
        print('Not an image of supported format: ', filename)
        sys.exit(1)
    
    file_path = os.path.join(source_folder, filename)
    
    if filename.lower().endswith('.heic'):
        jpg_file_path = file_path.replace('.heic', '.jpg').replace('.HEIC', '.jpg')
        if force or not os.path.exists(jpg_file_path):
            print('will convert heic', filename)
            convert_heic_to_jpg(file_path, jpg_file_path)
            file_path = jpg_file_path
        else:
            print('skipping heic that was already converted', filename)
            return

    print('will process', file_path)

    img = Image.open(file_path)
    thumb_img_path = os.path.join(thumbs_folder, os.path.basename(file_path))
    large_img_path = os.path.join(large_folder, os.path.basename(file_path))
    
    if img.width > img.height:
        print("rotating", file_path)
        img = img.rotate(-90, expand=True)
    
    # 1. thumb
    if force or not os.path.exists(thumb_img_path):
        width_percent = (215 / float(img.size[0]))
        new_height = int((float(img.size[1]) * float(width_percent)))
        img1 = img.resize((215, new_height), Image.LANCZOS)
        img1.save(thumb_img_path, quality=95)

    # 2. big
    if force or not os.path.exists(large_img_path):
        width_percent = (800 / float(img.size[0]))
        new_height = int((float(img.size[1]) * float(width_percent)))
        img2 = img.resize((800, new_height), Image.LANCZOS)
        img2.save(large_img_path, quality=95)
    
    
    
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Process an image')
    parser.add_argument('image_path', help='Path to the image file')
    args = parser.parse_args()

    folder, filename = os.path.split(args.image_path)
    process_image(folder, filename, True)