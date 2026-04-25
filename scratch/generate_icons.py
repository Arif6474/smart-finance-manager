from PIL import Image, ImageOps
import os

def generate_icons(source_path, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    img = Image.open(source_path)
    
    # 1. 192x192
    img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    img_192.save(os.path.join(output_dir, "icon-192x192.png"))
    print("Generated icon-192x192.png")
    
    # 1.5 144x144
    img_144 = img.resize((144, 144), Image.Resampling.LANCZOS)
    img_144.save(os.path.join(output_dir, "icon-144x144.png"))
    print("Generated icon-144x144.png")

    # 1.6 96x96
    img_96 = img.resize((96, 96), Image.Resampling.LANCZOS)
    img_96.save(os.path.join(output_dir, "icon-96x96.png"))
    print("Generated icon-96x96.png")
    
    # 2. 512x512
    img_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
    img_512.save(os.path.join(output_dir, "icon-512x512.png"))
    print("Generated icon-512x512.png")
    
    # 3. Maskable Icon (512x512 with safe area)
    # Maskable icons need to have a safe area (central 80% circle)
    # We'll put the logo in the center of a larger background
    maskable_size = 512
    # Create background (using white since the logo has white/transparent edges usually, 
    # but based on the logo description, a white or navy background works. 
    # The logo prompt used white background.)
    background_color = (255, 255, 255) # White
    maskable_img = Image.new('RGB', (maskable_size, maskable_size), background_color)
    
    # Resize logo to fit in safe area (roughly 70% of the total size)
    logo_size = int(maskable_size * 0.7)
    logo_resized = img.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    
    # Paste in center
    offset = ((maskable_size - logo_size) // 2, (maskable_size - logo_size) // 2)
    
    # If the image has transparency, use it as a mask
    if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
        maskable_img.paste(logo_resized, offset, logo_resized)
    else:
        maskable_img.paste(logo_resized, offset)
        
    maskable_img.save(os.path.join(output_dir, "icon-maskable.png"))
    print("Generated icon-maskable.png")

if __name__ == "__main__":
    generate_icons("public/logo.png", "public/icons")
