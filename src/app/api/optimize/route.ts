import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const maxDuration = 60;

export const PLATFORM_PRESETS = {
  // --- PRIMARY COCKPIT PRESETS ---
  fb_hd: { 
    name: 'Facebook Chuẩn HD (Max 2048px)', 
    platform: 'facebook',
    maxEdge: 2048, 
    width: null, 
    height: null 
  },
  ig_feed: { 
    name: 'Instagram Feed Dọc 4:5 (1080 × 1350px)', 
    platform: 'instagram',
    maxEdge: null, 
    width: 1080, 
    height: 1350 
  },
  story: { 
    name: 'Story / Reels (1080 × 1920px)', 
    platform: 'instagram',
    maxEdge: null, 
    width: 1080, 
    height: 1920 
  },

  // --- COMPATIBILITY PRESETS ---
  ig_portrait: { 
    name: 'Instagram Feed Dọc 4:5 (1080 × 1350px)', 
    platform: 'instagram',
    maxEdge: null, 
    width: 1080, 
    height: 1350 
  },
  ig_square: { 
    name: 'Instagram Vuông 1:1 (1080 × 1080px)', 
    platform: 'instagram',
    maxEdge: null, 
    width: 1080, 
    height: 1080 
  },
  ig_story: { 
    name: 'Instagram Story / Reels (1080 × 1920px)', 
    platform: 'instagram',
    maxEdge: null, 
    width: 1080, 
    height: 1920 
  },
  fb_portrait: { 
    name: 'Facebook Dọc 4:5 (1638 × 2048px)', 
    platform: 'facebook',
    maxEdge: null, 
    width: 1638, 
    height: 2048 
  },
  fb_story: { 
    name: 'Facebook Story (1080 × 1920px)', 
    platform: 'facebook',
    maxEdge: null, 
    width: 1080, 
    height: 1920 
  },
} as const;

type PlatformKey = keyof typeof PLATFORM_PRESETS;

function detectIccProfileInfo(iccBuffer?: Buffer, space?: string) {
  if (!iccBuffer || iccBuffer.length === 0) {
    return {
      name: 'Untagged (Gán chuẩn sRGB IEC61966-2.1)',
      isDisplayP3: false,
      isProSpace: false,
    };
  }

  const iccStr = iccBuffer.toString('latin1');

  if (iccStr.includes('Display P3') || iccStr.includes('DCI-P3') || iccStr.includes('Apple Wide Color')) {
    return {
      name: 'Display P3 (iPhone / Flagship OLED)',
      isDisplayP3: true,
      isProSpace: false,
    };
  }
  if (iccStr.includes('Adobe RGB') || iccStr.includes('AdobeRGB')) {
    return {
      name: 'Adobe RGB (1998) - Máy ảnh chuyên nghiệp',
      isDisplayP3: false,
      isProSpace: true,
    };
  }
  if (iccStr.includes('ProPhoto') || iccStr.includes('ROMM RGB')) {
    return {
      name: 'ProPhoto RGB - Máy ảnh RAW',
      isDisplayP3: false,
      isProSpace: true,
    };
  }
  if (space === 'cmyk' || space === 'lab') {
    return {
      name: `Không gian ${space.toUpperCase()}`,
      isDisplayP3: false,
      isProSpace: true,
    };
  }
  if (iccStr.includes('sRGB') || iccStr.includes('s R G B') || iccStr.includes('IEC61966')) {
    return {
      name: 'sRGB IEC61966-2.1',
      isDisplayP3: false,
      isProSpace: false,
    };
  }

  return {
    name: 'Embedded ICC Profile',
    isDisplayP3: false,
    isProSpace: false,
  };
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file ảnh trong yêu cầu tải lên.' }, { status: 400 });
    }

    const platform = (formData.get('platform') as PlatformKey) || 'fb_hd';
    const mode = (formData.get('mode') as 'portrait' | 'landscape') || 'portrait';
    const fitStyle = (formData.get('fitStyle') as 'original' | 'pad_blur' | 'pad_white' | 'pad_black' | 'cover') || 'cover';
    const deviceProfile = (formData.get('deviceProfile') as 'auto' | 'iphone' | 'android') || 'auto';
    const customQuality = Number(formData.get('quality')) || 92;

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // BƯỚC 1: Đọc Metadata gốc & Chuẩn bị pipeline
    const image = sharp(inputBuffer, { failOn: 'none' });
    const metadata = await image.metadata();

    const origWidth = metadata.width || 2048;
    const origHeight = metadata.height || 2048;

    // Tự động xoay đúng chiều theo EXIF Orientation trước khi xử lý
    let pipeline = image.rotate();

    // BƯỚC 2: Thuật toán Quy đổi Kích thước Thông minh (Lanczos3 Interpolation)
    const preset = PLATFORM_PRESETS[platform] || PLATFORM_PRESETS.fb_hd;

    if (preset.maxEdge) {
      // Facebook Chuẩn HD: Giữ nguyên khung hình gốc
      // Cạnh dài nhất <= 2048px: GIỮ NGUYÊN kích thước, không upscale làm vỡ ảnh!
      // Cạnh dài nhất > 2048px: Thu nhỏ với Lanczos3
      if (Math.max(origWidth, origHeight) > preset.maxEdge) {
        pipeline = pipeline.resize({
          width: origWidth >= origHeight ? preset.maxEdge : undefined,
          height: origHeight > origWidth ? preset.maxEdge : undefined,
          fit: 'inside',
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3,
        });
      }
    } else if (preset.width && preset.height) {
      // Định dạng khung cố định (IG Feed 4:5, Story 9:16, FB 4:5, v.v.)
      if (fitStyle === 'cover') {
        // Cắt vừa khung (fit: cover)
        pipeline = pipeline.resize({
          width: preset.width,
          height: preset.height,
          fit: 'cover',
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3,
        });
      } else if (fitStyle === 'pad_blur') {
        // NỀN MỜ NGHỆ THUẬT (pad_blur - default)
        // Tạo ảnh nền làm mờ bao phủ toàn bộ khung
        const bgBuffer = await sharp(inputBuffer, { failOn: 'none' })
          .rotate()
          .resize({
            width: preset.width,
            height: preset.height,
            fit: 'cover',
            kernel: sharp.kernel.lanczos3,
          })
          .blur(30)
          .modulate({ brightness: 0.72 })
          .toBuffer();

        // Tạo ảnh tiền cảnh sắc nét chứa trọn vẹn bố cục (contain) với nền trong suốt
        const fgBuffer = await sharp(inputBuffer, { failOn: 'none' })
          .rotate()
          .resize({
            width: preset.width,
            height: preset.height,
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 },
            kernel: sharp.kernel.lanczos3,
          })
          .png()
          .toBuffer();

        pipeline = sharp(bgBuffer).composite([{ input: fgBuffer, gravity: 'centre' }]);
      } else {
        // Mặc định hoặc pad_white / pad_black: Giữ trọn 100% bố cục ảnh gốc (fit: contain)
        const bg = fitStyle === 'pad_black' 
          ? { r: 18, g: 18, b: 18, alpha: 1 } 
          : { r: 255, g: 255, b: 255, alpha: 1 };

        pipeline = pipeline.resize({
          width: preset.width,
          height: preset.height,
          fit: 'contain',
          background: bg,
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3,
        });
      }
    }

    // BƯỚC 3: Thuật toán Làm nét Bù trừ Không Đổi Màu (CIE L*a*b* Luminance Sharpening)
    if (mode === 'portrait') {
      // Chế độ Chân dung / Đời thường:
      // sigma = 0.6: Viền siêu mảnh, không lộ lỗ chân lông
      // m1 = 0.0: Không làm nét vùng phẳng (bảo vệ da & chống noise 100%)
      // m2 = 1.2: Kích nét vùng có chi tiết rõ (mắt, mi, tóc, môi)
      pipeline = pipeline.sharpen({
        sigma: 0.6,
        m1: 0.0,
        m2: 1.2,
        x1: 2.0,
        y2: 10.0,
        y3: 20.0,
      });
    } else {
      // Chế độ Phong cảnh / Đồ ăn / Kiến trúc:
      // sigma = 0.8
      // m1 = 0.4: Nổi vân bề mặt lá cây, thớ thịt, chất liệu
      // m2 = 1.8: Tăng độ bén viền kiến trúc
      pipeline = pipeline.sharpen({
        sigma: 0.8,
        m1: 0.4,
        m2: 1.8,
        x1: 2.0,
        y2: 10.0,
        y3: 20.0,
      });
    }

    // BƯỚC 4: Thuật toán Bảo toàn Màu sắc Tuyệt đối (Zero-Shift Color Lock)
    const iccInfo = detectIccProfileInfo(metadata.icc, metadata.space);
    let colorAction = '';

    if (deviceProfile === 'android') {
      // Ép chuẩn Android: chuyển đổi sạch LittleCMS sang sRGB IEC61966-2.1
      pipeline = pipeline.toColorspace('srgb').withIccProfile('srgb');
      colorAction = 'Khóa chuẩn màu sRGB IEC61966-2.1 (Tương thích Android)';
    } else if (deviceProfile === 'iphone' || iccInfo.isDisplayP3) {
      // Chuẩn iPhone: bảo tồn Display P3 dải màu rộng OLED
      if (metadata.icc) {
        pipeline = pipeline.keepIccProfile();
      }
      colorAction = 'Bảo tồn tuyệt đối 100% Display P3 (Chuẩn Apple OLED)';
    } else if (iccInfo.isProSpace) {
      // Adobe RGB / ProPhoto / CMYK / LAB -> Chuyển sang sRGB với LittleCMS
      pipeline = pipeline.toColorspace('srgb').withIccProfile('srgb');
      colorAction = 'Chuyển đổi LittleCMS mượt sang sRGB (Bảo toàn tương phản)';
    } else if (metadata.icc) {
      // sRGB gốc hoặc thẻ khác -> Giữ nguyên 100% thẻ ICC!
      pipeline = pipeline.keepIccProfile();
      colorAction = 'Khóa nguyên bản thẻ màu gốc (ICC Lock)';
    } else {
      // Ảnh không có thẻ màu (Untagged) -> Nhúng thẻ chuẩn sRGB IEC61966-2.1
      pipeline = pipeline.withIccProfile('srgb');
      colorAction = 'Nhúng thẻ chuẩn sRGB IEC61966-2.1 chống lệch màu';
    }

    // BƯỚC 5: Thuật toán Đóng gói Chống Nén Kép (Anti-Recompression Encoding)
    // - Chroma Subsampling 4:4:4: Không làm mờ viền màu
    // - MozJPEG: Tối ưu hóa bảng Huffman & lượng tử hóa trellis
    // - Overshoot Deringing: Chống quầng sáng / răng cưa viền
    const outputBuffer = await pipeline
      .jpeg({
        quality: Math.min(Math.max(customQuality, 80), 98),
        chromaSubsampling: '4:4:4',
        mozjpeg: true,
        trellisQuantisation: true,
        overshootDeringing: true,
      })
      .toBuffer();

    // Đo lại kích thước sau khi xử lý
    const finalMeta = await sharp(outputBuffer).metadata();
    const finalWidth = finalMeta.width || origWidth;
    const finalHeight = finalMeta.height || origHeight;
    const elapsedMs = Date.now() - startTime;

    // Xây dựng response
    const headers = new Headers();
    headers.set('Content-Type', 'image/jpeg');
    headers.set('Content-Disposition', `attachment; filename="shield-${platform}-${mode}.jpg"`);
    
    // Metadata kỹ thuật gửi kèm theo Headers
    headers.set('X-Orig-Width', String(origWidth));
    headers.set('X-Orig-Height', String(origHeight));
    headers.set('X-Orig-Size', String(inputBuffer.length));
    headers.set('X-Opt-Width', String(finalWidth));
    headers.set('X-Opt-Height', String(finalHeight));
    headers.set('X-Opt-Size', String(outputBuffer.length));
    headers.set('X-Icc-Profile', encodeURIComponent(deviceProfile === 'android' ? 'sRGB IEC61966-2.1' : iccInfo.name));
    headers.set('X-Color-Action', encodeURIComponent(colorAction));
    headers.set('X-Sharpen-Mode', mode);
    headers.set('X-Chroma', '4:4:4');
    headers.set('X-Process-Time-Ms', String(elapsedMs));
    headers.set('Access-Control-Expose-Headers', '*');

    return new NextResponse(outputBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Lỗi khi tối ưu hóa ảnh:', error);
    return NextResponse.json(
      { 
        error: 'Đã xảy ra lỗi trong quá trình xử lý ảnh.', 
        details: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    );
  }
}
