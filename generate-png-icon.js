const fs = require('fs');
const path = require('path');

// 创建一个简单的512x512 PNG图标
function createPngIcon() {
    // PNG文件头
    const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    
    // IHDR块
    const width = 512;
    const height = 512;
    const bitDepth = 8;
    const colorType = 2; // RGB
    const compressionMethod = 0;
    const filterMethod = 0;
    const interlaceMethod = 0;
    
    const ihdrLength = Buffer.alloc(4);
    ihdrLength.writeUInt32BE(13, 0);
    
    const ihdrType = Buffer.from('IHDR');
    const ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(width, 0);
    ihdrData.writeUInt32BE(height, 4);
    ihdrData.writeUInt8(bitDepth, 8);
    ihdrData.writeUInt8(colorType, 9);
    ihdrData.writeUInt8(compressionMethod, 10);
    ihdrData.writeUInt8(filterMethod, 11);
    ihdrData.writeUInt8(interlaceMethod, 12);
    
    // 计算IHDR CRC
    const crc = require('zlib').crc32(Buffer.concat([ihdrType, ihdrData]));
    const ihdrCrc = Buffer.alloc(4);
    ihdrCrc.writeUInt32BE(crc, 0);
    
    // 创建图像数据（简单的蓝色背景，白色圆点）
    const pixelData = [];
    
    // 填充背景色（天蓝色）
    for (let y = 0; y < height; y++) {
        pixelData.push(0); // 过滤器类型
        for (let x = 0; x < width; x++) {
            // 计算到中心的距离
            const centerX = width / 2;
            const centerY = height / 2;
            const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            
            if (distance < 80) {
                // 白色圆点
                pixelData.push(255, 255, 255);
            } else {
                // 天蓝色背景
                pixelData.push(100, 150, 255);
            }
        }
    }
    
    const imageData = Buffer.from(pixelData);
    
    // 压缩图像数据
    const compressedData = require('zlib').deflateSync(imageData);
    
    // IDAT块
    const idatLength = Buffer.alloc(4);
    idatLength.writeUInt32BE(compressedData.length, 0);
    
    const idatType = Buffer.from('IDAT');
    const idatCrc = require('zlib').crc32(Buffer.concat([idatType, compressedData]));
    const idatCrcBuffer = Buffer.alloc(4);
    idatCrcBuffer.writeUInt32BE(idatCrc, 0);
    
    // IEND块
    const iendLength = Buffer.alloc(4);
    iendLength.writeUInt32BE(0, 0);
    
    const iendType = Buffer.from('IEND');
    const iendCrc = require('zlib').crc32(iendType);
    const iendCrcBuffer = Buffer.alloc(4);
    iendCrcBuffer.writeUInt32BE(iendCrc, 0);
    
    // 组合所有部分
    const pngBuffer = Buffer.concat([
        pngSignature,
        ihdrLength,
        ihdrType,
        ihdrData,
        ihdrCrc,
        idatLength,
        idatType,
        compressedData,
        idatCrcBuffer,
        iendLength,
        iendType,
        iendCrcBuffer
    ]);
    
    return pngBuffer;
}

// 保存PNG文件
const pngBuffer = createPngIcon();
fs.writeFileSync('todo-icon-512.png', pngBuffer);

console.log('PNG图标已生成：todo-icon-512.png');
console.log('文件大小：', pngBuffer.length, '字节');