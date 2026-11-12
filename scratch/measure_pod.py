from PIL import Image
import numpy as np

im = Image.open('C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/scratch/pod_step1_zoom.png').convert('RGB')
arr = np.array(im)
w, h = im.size
print('Zoom image size:', w, h)

# Find the bounding box of the white pod
# The pod has white/offwhite color: r>235, g>235, b>235
pod_pixels = []
for y in range(h):
    for x in range(w):
        r, g, b = arr[y, x]
        if r > 238 and g > 238 and b > 238:
            pod_pixels.append((x, y))

xs, ys = zip(*pod_pixels)
min_x, max_x = min(xs), max(xs)
min_y, max_y = min(ys), max(ys)
pod_w = max_x - min_x + 1
pod_h = max_y - min_y + 1
print(f'Pod bounding box in crop: x=[{min_x}, {max_x}] (w={pod_w}), y=[{min_y}, {max_y}] (h={pod_h})')
# Crop in full image step 1 was x=[80+min_x, 80+max_x], y=[220+min_y, 220+max_y]
full_w = 460
print(f'Pod relative to full screen (width 460):')
print(f'X: [{80+min_x}, {80+max_x}], width={pod_w} ({pod_w/full_w*100:.1f}% of screen)')
print(f'Y: [{220+min_y}, {220+max_y}], height={pod_h}')

# Now find the 3 buttons inside the pod
# Button 1 is from x1 to x2, Button 2 is from x3 to x4, Button 3 is from x5 to x6
# Buttons have lavender or blue colors (b > 200, r < 230)
btn_y = (min_y + max_y) // 2
print(f'Sampling row y={btn_y} across pod x=[{min_x}..{max_x}]:')
for x in range(min_x, max_x + 1, 5):
    r, g, b = arr[btn_y, x]
    print(f'x={x}: ({r},{g},{b})', end=' | ')
print()

