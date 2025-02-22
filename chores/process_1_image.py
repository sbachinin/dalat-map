import argparse
from PIL import Image
import os

thumbs_folder = 'dalat-map-images/thumbs'
large_folder = 'dalat-map-images/large'

def process_image(image_path):
    img = Image.open(image_path)
    
    if img.width > img.height:
        img = img.rotate(90, expand=True)
    
    # 1. thumb
    width_percent = (215 / float(img.size[0]))
    new_height = int((float(img.size[1]) * float(width_percent)))
    img1 = img.resize((215, new_height), Image.LANCZOS)
    optimized_img_path = os.path.join(thumbs_folder, os.path.basename(image_path))
    img1.save(optimized_img_path, quality=95)

    # 2. big
    width_percent = (800 / float(img.size[0]))
    new_height = int((float(img.size[1]) * float(width_percent)))
    img2 = img.resize((800, new_height), Image.LANCZOS)
    large_img_path = os.path.join(large_folder, os.path.basename(image_path))
    img2.save(large_img_path, quality=95)
    
    
    
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Process an image')
    parser.add_argument('image_path', help='Path to the image file')
    args = parser.parse_args()

    process_image(args.image_path)