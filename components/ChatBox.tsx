'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

export default function ChatBox() {
  const [industry, setIndustry] = useState('Mỹ phẩm');
  const [tone, setTone] = useState('lãng mạn');
  const [email, setEmail] = useState('');
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { industry, tone, email },
    onFinish: async (message) => {
      if (email) {
        await fetch('/api/send', {
          method: 'POST',
          body: JSON.stringify({ email, content: message.content }),
          headers: { 'Content-Type': 'application/json' },
        });
      }
    },
  });

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">🤖 Chatbot Viết Nội Dung Bán Hàng</h1>

      <div className="space-y-2">
        <select className="w-full border rounded p-2" value={industry} onChange={(e) => setIndustry(e.target.value)}>
          <option value="Mỹ phẩm">Mỹ phẩm</option>
          <option value="Thời trang">Thời trang</option>
          <option value="Mẹ và bé">Mẹ và bé</option>
          <option value="Sức khỏe">Sức khỏe</option>
        </select>

        <select className="w-full border rounded p-2" value={tone} onChange={(e) => setTone(e.target.value)}>
          <option value="lãng mạn">Lãng mạn</option>
          <option value="hài hước">Hài hước</option>
          <option value="chuyên gia">Chuyên gia</option>
        </select>

        <input
          className="w-full border rounded p-2"
          type="email"
          placeholder="Nhập email để nhận nội dung (tuỳ chọn)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="border rounded p-2 h-60 overflow-y-auto text-sm bg-white">
        {messages.map((m) => (
          <div key={m.id} className="mb-2">
            <b>{m.role === 'user' ? 'Bạn' : 'Chatbot'}:</b> {m.content}
          </div>
        ))}
        {isLoading && <div>⏳ Đang tạo nội dung...</div>}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={input}
          onChange={handleInputChange}
          placeholder="Nhập yêu cầu viết nội dung..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded">Gửi</button>
      </form>
    </div>
  );
}
