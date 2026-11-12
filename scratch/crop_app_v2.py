from PIL import Image

im_rest = Image.open('C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/screen_rest_v2.png')
crop_rest = im_rest.crop((0, 0, im_rest.size[0], int(im_rest.size[1] * 0.44)))
crop_rest.save('C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/scratch/app_rest_v2.png')

im_scrolled = Image.open('C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/screen_scrolled_v2.png')
crop_scrolled = im_scrolled.crop((0, 0, im_scrolled.size[0], int(im_scrolled.size[1] * 0.44)))
crop_scrolled.save('C:/Users/sowbh/.gemini/antigravity/brain/35866e92-86a6-4482-8ca8-928dcde910c6/scratch/app_scrolled_v2.png')

print('Saved app_rest_v2.png and app_scrolled_v2.png')

