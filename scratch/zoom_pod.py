from PIL import Image

# Zoom in on the switcher pod in step 1 and step 5
im1 = Image.open('C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/scratch/step_1_top.png')
w1, h1 = im1.size
# Pod is around center horizontally (x=120..340), y=220..330
pod1 = im1.crop((80, 220, 380, 330))
pod1.save('C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/scratch/pod_step1_zoom.png')

im5 = Image.open('C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/scratch/step_5_top.png')
pod5 = im5.crop((80, 110, 380, 220))
pod5.save('C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/scratch/pod_step5_zoom.png')

print('Saved pod_step1_zoom.png and pod_step5_zoom.png')

