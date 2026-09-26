import type { Metadata } from "next";
import { Barlow_Condensed, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: '--barlow-condensed',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800']
})

const notoSansKR = Noto_Sans_KR({
  variable: '--noto-sans-kr',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800']
})

export const metadata: Metadata = {
  title: "Kang Teacher Coding",
  description: "강쌤 코딩 테스트",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${notoSansKR.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
