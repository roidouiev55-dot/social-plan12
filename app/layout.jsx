import "./globals.css";

export const metadata = {
  title: "A&A HAFAKOT · תוכנית סושיאל",
  description: "תוכנית עבודה יומית לניהול 4 חשבונות אינסטגרם",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
