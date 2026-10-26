import sharp from 'sharp';

// Helper to run request against optimize route
async function runOptimizeRequest(buffer, filename, platform, mode, fitStyle = 'original') {
  const { POST } = await import('../src/app/api/optimize/route.ts');
  const formData = new FormData();
  formData.append('image', new Blob([buffer], { type: 'image/jpeg' }), filename);
  formData.append('platform', platform);
  formData.append('mode', mode);
  formData.append('fitStyle', fitStyle);

  const req = new Request('http://localhost:3000/api/optimize', {
    method: 'POST',
    body: formData,
  });

  const res = await POST(req);
  const outArrayBuffer = await res.arrayBuffer();
  const outBuffer = Buffer.from(outArrayBuffer);
  const meta = await sharp(outBuffer).metadata();

  return {
    status: res.status,
    headers: {
      width: Number(res.headers.get('x-opt-width')),
      height: Number(res.headers.get('x-opt-height')),
      size: Number(res.headers.get('x-opt-size')),
      iccProfile: decodeURIComponent(res.headers.get('x-icc-profile') || ''),
      colorAction: decodeURIComponent(res.headers.get('x-color-action') || ''),
      chroma: res.headers.get('x-chroma'),
      timeMs: Number(res.headers.get('x-process-time-ms')),
    },
    meta,
    outBuffer,
  };
}

async function runAllTests() {
  console.log('================================================================');
  console.log('🧪 BẮT ĐẦU CHẠY BỘ TEST CHUYÊN BIỆT FACEBOOK & INSTAGRAM');
  console.log('================================================================\n');

  let passedTests = 0;
  const totalTests = 6;

  // TEST 1: Facebook Chuẩn HD (Max 2048px, Chân dung bảo vệ da, Chroma 4:4:4)
  console.log('▶ [TEST 1] Facebook Chuẩn HD (Bảo vệ da, sigma=0.6, m1=0.0, m2=1.2, Max 2048px)');
  const portraitRaw = await sharp({
    create: { width: 3600, height: 2400, channels: 3, background: { r: 215, g: 170, b: 145 } }
  }).jpeg().toBuffer();

  const r1 = await runOptimizeRequest(portraitRaw, 'fb_night_portrait.jpg', 'fb_hd', 'portrait');
  console.log(`   - Kích thước xuất: 3600x2400 -> ${r1.meta.width}x${r1.meta.height} (Chuẩn FB HD <= 2048px: ${r1.meta.width === 2048 ? 'ĐẠT' : 'CHƯA'})`);
  console.log(`   - Chroma Subsampling: ${r1.meta.chromaSubsampling} (Kỳ vọng: 4:4:4)`);
  console.log(`   - Thời gian xử lý: ${r1.headers.timeMs}ms`);
  if (r1.meta.width === 2048 && r1.meta.chromaSubsampling === '4:4:4') {
    console.log('   ✅ TEST 1 THÀNH CÔNG!\n');
    passedTests++;
  } else {
    console.log('   ❌ TEST 1 THẤT BẠI!\n');
  }

  // TEST 2: Facebook Feed Dọc 4:5 Độ Nét Cao (1638 × 2048 px)
  console.log('▶ [TEST 2] Facebook Feed Dọc 4:5 (Khung 1638 × 2048px chiếm trọn newfeed)');
  const fbPortRaw = await sharp({
    create: { width: 3000, height: 2000, channels: 3, background: { r: 60, g: 110, b: 230 } }
  }).jpeg().toBuffer();

  const r2 = await runOptimizeRequest(fbPortRaw, 'fb_portrait_test.jpg', 'fb_portrait', 'landscape', 'pad_white');
  console.log(`   - Kích thước xuất: ${r2.meta.width}x${r2.meta.height} (Kỳ vọng chuẩn: 1638x2048)`);
  if (r2.meta.width === 1638 && r2.meta.height === 2048) {
    console.log('   ✅ TEST 2 THÀNH CÔNG!\n');
    passedTests++;
  } else {
    console.log('   ❌ TEST 2 THẤT BẠI!\n');
  }

  // TEST 3: Instagram Feed Dọc 4:5 (1080 × 1350 px có viền trắng)
  console.log('▶ [TEST 3] Instagram Feed Dọc 4:5 (1080 × 1350px chuẩn vàng)');
  const igRaw = await sharp({
    create: { width: 1920, height: 1080, channels: 3, background: { r: 180, g: 100, b: 220 } }
  }).jpeg().toBuffer();

  const r3 = await runOptimizeRequest(igRaw, 'ig_portrait_test.jpg', 'ig_portrait', 'landscape', 'pad_white');
  console.log(`   - Kích thước xuất: ${r3.meta.width}x${r3.meta.height} (Kỳ vọng chuẩn: 1080x1350)`);
  if (r3.meta.width === 1080 && r3.meta.height === 1350) {
    console.log('   ✅ TEST 3 THÀNH CÔNG!\n');
    passedTests++;
  } else {
    console.log('   ❌ TEST 3 THẤT BẠI!\n');
  }

  // TEST 4: Instagram Vuông 1:1 (1080 × 1080 px)
  console.log('▶ [TEST 4] Instagram Feed Vuông 1:1 (1080 × 1080px)');
  const igSqRaw = await sharp({
    create: { width: 1600, height: 1200, channels: 3, background: { r: 240, g: 180, b: 60 } }
  }).jpeg().toBuffer();

  const r4 = await runOptimizeRequest(igSqRaw, 'ig_square_test.jpg', 'ig_square', 'portrait', 'pad_white');
  console.log(`   - Kích thước xuất: ${r4.meta.width}x${r4.meta.height} (Kỳ vọng chuẩn: 1080x1080)`);
  if (r4.meta.width === 1080 && r4.meta.height === 1080) {
    console.log('   ✅ TEST 4 THÀNH CÔNG!\n');
    passedTests++;
  } else {
    console.log('   ❌ TEST 4 THẤT BẠI!\n');
  }

  // TEST 5: Instagram Story / Reels 9:16 (1080 × 1920 px)
  console.log('▶ [TEST 5] Instagram Story / Reels 9:16 (1080 × 1920px Cắt vừa khung cover)');
  const igStoryRaw = await sharp({
    create: { width: 2400, height: 2400, channels: 3, background: { r: 220, g: 50, b: 120 } }
  }).jpeg().toBuffer();

  const r5 = await runOptimizeRequest(igStoryRaw, 'ig_story_test.jpg', 'ig_story', 'portrait', 'cover');
  console.log(`   - Kích thước xuất: ${r5.meta.width}x${r5.meta.height} (Kỳ vọng chuẩn: 1080x1920)`);
  if (r5.meta.width === 1080 && r5.meta.height === 1920) {
    console.log('   ✅ TEST 5 THÀNH CÔNG!\n');
    passedTests++;
  } else {
    console.log('   ❌ TEST 5 THẤT BẠI!\n');
  }

  // TEST 6: Instagram Feed 4:5 với Nền Mờ Nghệ Thuật (pad_blur, 1080 × 1350 px)
  console.log('▶ [TEST 6] Instagram Feed 4:5 với Nền Mờ Nghệ Thuật (pad_blur 1080 × 1350px)');
  const landscapeRaw = await sharp({
    create: { width: 2500, height: 1600, channels: 3, background: { r: 50, g: 150, b: 200 } }
  }).jpeg().toBuffer();

  const r6 = await runOptimizeRequest(landscapeRaw, 'ig_blur_pad.jpg', 'ig_feed', 'portrait', 'pad_blur');
  console.log(`   - Kích thước xuất: ${r6.meta.width}x${r6.meta.height} (Kỳ vọng: 1080x1350)`);
  if (r6.meta.width === 1080 && r6.meta.height === 1350) {
    console.log('   ✅ TEST 6 THÀNH CÔNG!\n');
    passedTests++;
  } else {
    console.log('   ❌ TEST 6 THẤT BẠI!\n');
  }

  console.log('================================================================');
  console.log(`🏆 KẾT QUẢ TỔNG HỢP: ${passedTests}/${totalTests} BÀI TEST FB & IG ĐẠT CHUẨN XUẤT SẮC!`);
  console.log('================================================================');
}

runAllTests().catch(console.error);
