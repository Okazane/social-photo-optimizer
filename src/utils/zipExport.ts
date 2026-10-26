import JSZip from 'jszip';
import { ImageItem, PlatformKey, SharpenMode } from '@/types/optimizer';

export async function exportItemsAsZip(
  items: ImageItem[],
  platform: PlatformKey,
  mode: SharpenMode
): Promise<void> {
  const completedItems = items.filter((item) => item.status === 'done' && item.optBlob);
  if (completedItems.length === 0) return;

  const zip = new JSZip();

  completedItems.forEach((item, index) => {
    if (!item.optBlob) return;
    const cleanName = item.name.replace(/\.[^/.]+$/, '');
    const filename = `${String(index + 1).padStart(2, '0')}_shield_${platform}_${mode}_${cleanName}.jpg`;
    zip.file(filename, item.optBlob);
  });

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SocialPic_Shield_${platform}_${completedItems.length}_photos.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
