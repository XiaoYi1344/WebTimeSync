import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_NAME = "Face Attendance";
const SITE_URL = "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${SITE_NAME} – Quản lý chấm công`,
    template: `%s | ${SITE_NAME}`,
  },

  description:
    "Hệ thống quản lý chấm công và nhận diện khuôn mặt, hỗ trợ quản lý nhân viên, ca làm việc, điểm danh và theo dõi tình trạng chấm công.",

  applicationName: SITE_NAME,

  keywords: [
    "chấm công",
    "chấm công khuôn mặt",
    "nhận diện khuôn mặt",
    "face recognition",
    "face attendance",
    "quản lý nhân viên",
    "quản lý ca làm việc",
    "điểm danh nhân viên",
    "attendance management",
  ],

  authors: [
    {
      name: SITE_NAME,
    },
  ],

  creator: SITE_NAME,
  publisher: SITE_NAME,

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} – Quản lý chấm công`,
    description:
      "Hệ thống quản lý chấm công và nhận diện khuôn mặt dành cho doanh nghiệp.",
    images: [
      {
        url: "/sync.png",
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },

  twitter: {
    card: "summary",
    title: `${SITE_NAME} – Quản lý chấm công`,
    description:
      "Hệ thống quản lý chấm công và nhận diện khuôn mặt dành cho doanh nghiệp.",
    images: ["/sync.png"],
  },

  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },

  icons: {
    icon: "/sync.png",
    shortcut: "/sync.png",
    apple: "/sync.png",
  },

  // manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,

              style: {
                background: "#171717",
                color: "#ffffff",
                border: "1px solid #262626",
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
              },

              success: {
                duration: 3000,
              },

              error: {
                duration: 4000,
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
