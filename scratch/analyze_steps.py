import os
from PIL import Image
import numpy as np

out_dir = 'C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/scratch'

for step in range(1, 6):
    img_path = os.path.join(out_dir, f'step_{step}_top.png')
    im = Image.open(img_path).convert('RGB')
    arr = np.array(im)
    w, h = im.size
    cx = w // 2

    # Find bottom-most lavender row at x=50 (left wing), x=cx (center), x=w-50 (right wing)
    def find_bottom_lavender(col):
        bottom_y = -1
        for y in range(40, h):
            r, g, b = int(arr[y, col, 0]), int(arr[y, col, 1]), int(arr[y, col, 2])
            # Lavender is blue-dominant (b > 180 and b > r + 30)
            if b > 180 and b > r + 20:
                bottom_y = y
        return bottom_y

    # Find the button pod bounding box (where is the white capsule or where are the buttons?)
    # Let's inspect column cx from y=100 to 300
    print(f'=== STEP {step} ===')
    left_lav = find_bottom_lavender(50)
    center_lav = find_bottom_lavender(cx)
    right_lav = find_bottom_lavender(w - 50)
    print(f'Bottom lavender: left={left_lav}, center={center_lav}, right={right_lav}')

    # Trace boundary between lavender and white/pod across x=30 to w-30 (step 20)
    boundary = []
    for x in range(30, w-30, 20):
        # find the transition from lavender to white/grey
        found_y = -1
        for y in range(50, h):
            r, g, b = int(arr[y, x, 0]), int(arr[y, x, 1]), int(arr[y, x, 2])
            # if we encounter white or light grey pod or page background
            if r > 210 and g > 210 and b > 210:
                found_y = y
                break
        boundary.append((x, found_y))
    
    print('Boundary (first white/light pixel):')
    for x, y in boundary[::2]:
        print(f'({x},{y})', end=' ')
    print()


