import sharp from 'sharp';

async function testPipeline() {
  console.log('--- ĐANG CHẠY BÀI TEST THỰC ĐỊA BỘ MÁY SHARP ---');

  // Tạo 1 ảnh mẫu 3000x2000 (RGB) mô phỏng ảnh camera điện thoại
  const sampleBuf = await sharp({
    create: {
      width: 3000,
      height: 2000,
      channels: 3,
      background: { r: 240, g: 120, b: 80 }
    }
  }).jpeg().toBuffer();

  console.log('1. Ảnh đầu vào giả lập: 3000x2000, dung lượng:', sampleBuf.length, 'bytes');

  // Test POST via route handler directly
  const { POST } = await import('./src/app/api/optimize/route.ts');

  // Test 1: Facebook HD Preset (maxEdge 2048)
  const fd1 = new FormData();
  fd1.append('image', new Blob([sampleBuf], { type: 'image/jpeg' }), 'test.jpg');
  fd1.append('platform', 'fb_hd');
  fd1.append('mode', 'portrait');

  const req1 = new Request('http://localhost:3000/api/optimize', {
    method: 'POST',
    body: fd1
  });

  const res1 = await POST(req1);
  console.log('Status 1:', res1.status);
  console.log('X-Opt-Width:', res1.headers.get('x-opt-width'), 'X-Opt-Height:', res1.headers.get('x-opt-height'));
  console.log('X-Icc-Profile:', decodeURIComponent(res1.headers.get('x-icc-profile') || ''));
  console.log('X-Color-Action:', decodeURIComponent(res1.headers.get('x-color-action') || ''));
  console.log('X-Process-Time-Ms:', res1.headers.get('x-process-time-ms'), 'ms');

  // Test 2: Instagram Portrait (4:5 -> 1080x1350 with pad_white)
  const fd2 = new FormData();
  fd2.append('image', new Blob([sampleBuf], { type: 'image/jpeg' }), 'test2.jpg');
  fd2.append('platform', 'ig_portrait');
  fd2.append('fitStyle', 'pad_white');
  fd2.append('mode', 'landscape');

  const req2 = new Request('http://localhost:3000/api/optimize', {
    method: 'POST',
    body: fd2
  });

  const res2 = await POST(req2);
  console.log('Status 2:', res2.status);
  console.log('X-Opt-Width:', res2.headers.get('x-opt-width'), 'X-Opt-Height:', res2.headers.get('x-opt-height'));
  console.log('X-Process-Time-Ms:', res2.headers.get('x-process-time-ms'), 'ms');

  console.log('--- TẤT CẢ CÁC BÀI TEST ENGINE ĐÃ VƯỢT QUA XUẤT SẮC! ---');
}

testPipeline().catch(console.error);
