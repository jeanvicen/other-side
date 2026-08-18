from pathlib import Path
from PIL import Image

root = Path('/home/ubuntu/other-side')
source = root / 'icons' / 'other-side-logo-source.png'
out = root / 'icons'

image = Image.open(source).convert('RGBA')
for size, filename in [(32, 'favicon-32.png'), (180, 'apple-touch-icon.png'), (192, 'icon-192.png'), (512, 'icon-512.png'), (512, 'icon-512-maskable.png')]:
    resized = image.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(out / filename, optimize=True)
