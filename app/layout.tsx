export const metadata = {
  title: 'AI Selling Chatbot',
  description: 'Chatbot AI viết nội dung bán hàng tự động',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
