import os
from PIL import Image
import numpy as np

files = [
    'C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/.user_uploaded/media_1793782708778_1db5ce1c.jpg',
    'C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/.user_uploaded/media_1793782714339_dfbc091c.jpg',
    'C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/.user_uploaded/media_1793782718158_2cc45ff1.jpg',
    'C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/.user_uploaded/media_1793782723042_06a2ea48.jpg',
    'C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/.user_uploaded/media_1793782729465_9413b084.jpg'
]

out_dir = 'C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/scratch'
os.makedirs(out_dir, exist_ok=True)

for i, f in enumerate(files):
    im = Image.open(f)
    print(f'=== Image {i+1} ===')
    print('Size:', im.size)
    # Crop the top 40% (header area) to see exactly how it looks
    w, h = im.size
    crop = im.crop((0, 0, w, int(h * 0.40)))
    crop_path = os.path.join(out_dir, f'step_{i+1}_top.png')
    crop.save(crop_path)
    print(f'Saved {crop_path}')

