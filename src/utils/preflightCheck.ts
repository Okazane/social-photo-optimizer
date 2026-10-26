/**
 * Pre-flight check để đảm bảo:
 * 1. File ảnh tải lên không vượt quá giới hạn 4.5MB của Serverless/Vercel
 * 2. Tự động chuyển đổi các file .HEIC/.HEIF từ iPhone sang định dạng JPEG chất lượng cao (Q=96)
 *    ngay trên trình duyệt (sử dụng bộ giải mã phần cứng Apple của iOS Safari)
 *    để tránh lỗi thiếu plugin libde265 khi xử lý bằng Sharp trên server.
 */
export async function preflightPrepareImage(file: File): Promise<{
  processedFile: File;
  wasResized: boolean;
  originalSize: number;
  newSize: number;
}> {
  const MAX_PAYLOAD_BYTES = 4.2 * 1024 * 1024; // 4.2 MB ngưỡng an toàn cho Vercel 4.5MB limit

  const isHeic =
    file.name.toLowerCase().endsWith('.heic') ||
    file.name.toLowerCase().endsWith('.heif') ||
    file.type === 'image/heic' ||
    file.type === 'image/heif';

  // Nếu file nhỏ hơn 4.2MB và KHÔNG phải HEIC -> Giữ nguyên gửi trực tiếp
  if (file.size <= MAX_PAYLOAD_BYTES && !isHeic) {
    return {
      processedFile: file,
      wasResized: false,
      originalSize: file.size,
      newSize: file.size,
    };
  }

  // Chuyển đổi HEIC hoặc Thu nhỏ sơ bộ file > 4.2MB qua Canvas
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      const maxDim = Math.max(width, height);
      // Giới hạn tối đa 3200px (vẫn vượt xa chuẩn 2048px của Facebook và 1080px của Instagram)
      const targetMax = Math.min(maxDim, 3200);
      const scale = targetMax / maxDim;

      const targetWidth = Math.round(width * scale);
      const targetHeight = Math.round(height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve({
          processedFile: file,
          wasResized: false,
          originalSize: file.size,
          newSize: file.size,
        });
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Export JPEG chất lượng 96% để Sharp tiếp tục làm nét L* và gắn profile ICC
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({
              processedFile: file,
              wasResized: false,
              originalSize: file.size,
              newSize: file.size,
            });
            return;
          }

          const cleanName = file.name.replace(/\.(heic|heif|png|webp|jpeg|jpg)$/i, '') + '.jpg';

          const safeFile = new File([blob], cleanName, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });

          resolve({
            processedFile: safeFile,
            wasResized: true,
            originalSize: file.size,
            newSize: safeFile.size,
          });
        },
        'image/jpeg',
        0.96
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        processedFile: file,
        wasResized: false,
        originalSize: file.size,
        newSize: file.size,
      });
    };

    img.src = url;
  });
}
