import os
from PIL import Image

# if not installed, pip install Pillow

# Define the source folder and the destination folder
source_folder = '../dalat-map-images/originals'  # Change this to your source folder
thumbs_folder = '../dalat-map-images/thumbs'  # Change this to your thumbs folder

# Create thumbs folder if it doesn't exist
os.makedirs(thumbs_folder, exist_ok=True)

# Loop through all files in the source folder
for filename in os.listdir(source_folder):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
        # Open an image file
        img_path = os.path.join(source_folder, filename)
        with Image.open(img_path) as img:
            # Calculate new height to maintain the aspect ratio
            width_percent = (215 / float(img.size[0]))
            new_height = int((float(img.size[1]) * float(width_percent)))

            # Resize the image using LANCZOS filter
            img = img.resize((215, new_height), Image.LANCZOS)

            # Save the optimized image in the thumbs folder
            optimized_img_path = os.path.join(thumbs_folder, filename)
            img.save(optimized_img_path, quality=95)

print("Images have been resized and saved in the thumbs folder.")
