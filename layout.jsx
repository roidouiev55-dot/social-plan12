import "./globals.css";

export const metadata = {
  title: "תוכנית סושיאל · יוני–יולי 2026",
  description: "תוכנית עבודה יומית לניהול 4 חשבונות אינסטגרם",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
