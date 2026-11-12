from PIL import Image
import numpy as np

files = [
    'C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/.user_uploaded/media_1793782708778_1db5ce1c.jpg',
    'C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/.user_uploaded/media_1793782714339_dfbc091c.jpg',
    'C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/.user_uploaded/media_1793782718158_2cc45ff1.jpg',
    'C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/.user_uploaded/media_1793782723042_06a2ea48.jpg',
    'C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/.user_uploaded/media_1793782729465_9413b084.jpg'
]

for i, f in enumerate(files):
    im = Image.open(f).convert('RGB')
    arr = np.array(im)
    w, h = im.size
    # Print the exact details of the pod:
    # Where does the white capsule start and end horizontally?
    # Where does the white capsule start and end vertically?
    # Where are the 3 buttons?
    # Let's inspect step 1:
    if i == 0:
        print('=== STEP 1 DETAILS ===')
        # Check rows 240..315, column cx=230
        for y in range(240, 315, 3):
            r, g, b = arr[y, 230]
            print(f'y={y}: rgb=({r}, {g}, {b})')
        # Check row 280 across x
        print('Row 280 (across buttons):')
        for x in range(80, 380, 10):
            r, g, b = arr[280, x]
            print(f'x={x}: rgb=({r}, {g}, {b})', end=' | ')
        print()
