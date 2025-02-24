import argparse
import os
import sys
from process_1_image import process_image

# HOW TO RUN THIS
# in project root, "source myenv/bin/activate"
# python chores/resize_all_images.py

orig_other_folder = 'dalat-map-images/orig-other'
orig_highlights_folder = 'dalat-map-images/orig-highlights'
borrowed_folder = 'dalat-map-images/borrowed'
thumbs_folder = 'dalat-map-images/thumbs'
large_folder = 'dalat-map-images/large'

os.makedirs(thumbs_folder, exist_ok=True)
os.makedirs(large_folder, exist_ok=True)



def resize_from_folder(source_folder, force=False):        
    
    for filename in os.listdir(source_folder):
        process_image(source_folder, filename, force)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Resize images')
    parser.add_argument('-force', action='store_true', help='Resize all images, overwriting existing files')
    args = parser.parse_args()
    
    if args.force:
        for filename in os.listdir(thumbs_folder):
            file_path = os.path.join(thumbs_folder, filename)
            if os.path.isfile(file_path):
                os.remove(file_path)
        for filename in os.listdir(large_folder):
            file_path = os.path.join(large_folder, filename)
            if os.path.isfile(file_path):
                os.remove(file_path)

    resize_from_folder(orig_highlights_folder, args.force)
    resize_from_folder(orig_other_folder, args.force)
    resize_from_folder(borrowed_folder, args.force)
    
    print("Images have been resized")
