import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SocialPic Shield - Phòng Tối Tối Ưu Ảnh Facebook & Instagram",
  description:
    "Bảo toàn màu sắc 100% Display P3 / sRGB, làm nét vi sợi trên kênh Luminance và chống nén mờ trên Facebook, Instagram.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SocialPic Shield",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0A0A0C",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark h-full bg-[#0A0A0C] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full w-full overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] bg-[#0A0A0C] text-slate-100">
        {children}
      </body>
    </html>
  );
}
