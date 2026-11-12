from PIL import Image
import numpy as np

for step in [1, 3, 5]:
    im = Image.open(f'C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/scratch/step_{step}_top.png').convert('RGB')
    arr = np.array(im)
    w, h = im.size
    print(f'=================== STEP {step} (size {w}x{h}) ===================')
    # Let's inspect y around the bottom of the header
    # For step 1: y=230..320
    # For step 3: y=170..260
    # For step 5: y=130..210
    if step == 1:
        yrange = range(230, 320, 4)
    elif step == 3:
        yrange = range(170, 260, 4)
    else:
        yrange = range(130, 210, 4)

    for y in yrange:
        line = f'{y:03d}: '
        for x in range(20, w-20, 8):
            r, g, b = int(arr[y, x, 0]), int(arr[y, x, 1]), int(arr[y, x, 2])
            # classify:
            if b > 180 and b > r + 30:
                char = '#' # Lavender header
            elif r > 230 and g > 230 and b > 230:
                char = '.' # Pure white
            elif b > 180 and r > 160:
                char = '=' # Light lavender / button inactive
            elif b > 200 and r < 140:
                char = '@' # Active button / deep purple
            else:
                char = '+' # Other (pod container, borders, etc.)
            line += char
        print(line)
