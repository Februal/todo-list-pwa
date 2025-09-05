from PIL import Image, ImageDraw
import os

def create_png_icons():
    """创建PWA所需的PNG图标"""
    
    # 创建目录
    if not os.path.exists('icons'):
        os.makedirs('icons')
    
    # 定义图标尺寸
    sizes = [512, 192, 144, 96, 72, 48]
    
    for size in sizes:
        # 创建新图像
        img = Image.new('RGBA', (size, size), (37, 99, 235, 255))  # #2563eb
        draw = ImageDraw.Draw(img)
        
        # 计算圆角
        corner_radius = size // 8
        
        # 创建圆角矩形蒙版
        mask = Image.new('L', (size, size), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, size-1, size-1], corner_radius, fill=255)
        
        # 应用圆角
        img.putalpha(mask)
        
        # 添加简单的圆点图案
        dot_size = max(1, size // 64)
        spacing = size // 4
        
        for i in range(1, 4):
            for j in range(1, 4):
                x = i * spacing
                y = j * spacing
                dot_radius = size // 16
                
                # 绘制白色圆点
                draw.ellipse([x-dot_radius, y-dot_radius, x+dot_radius, y+dot_radius], 
                           fill=(255, 255, 255, 255))
        
        # 保存PNG文件
        filename = f'icons/icon-{size}x{size}.png'
        img.save(filename, 'PNG', quality=95)
        print(f"✅ 创建完成: {filename}")
    
    print("\n🎨 所有PNG图标已创建完成！")
    print("📁 文件列表:")
    for size in sizes:
        print(f"   - icons/icon-{size}x{size}.png")

if __name__ == "__main__":
    try:
        create_png_icons()
    except ImportError:
        print("❌ 需要安装PIL库")
        print("💡 请运行: pip install Pillow")
        print("或者使用在线工具生成图标")