// app/api/send/route.ts
import { transporter } from '@/lib/email';

export async function POST(req: Request) {
  const { email, content } = await req.json();

  if (!email || !content) {
    return new Response('Thiếu dữ liệu', { status: 400 });
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Nội dung bạn vừa tạo từ Chatbot AI',
    html: `<div style="font-family:sans-serif"><h2>Nội dung từ Chatbot:</h2><p>${content}</p></div>`,
  });

  return new Response('Đã gửi email thành công');
}
