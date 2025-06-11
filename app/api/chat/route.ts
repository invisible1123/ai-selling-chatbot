// app/api/chat/route.ts
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { prisma } from '@/lib/db';
import { notifyIntegrations } from '@/lib/integrations';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { messages, industry, tone, email } = await req.json();

  const systemPrompt = `Bạn là chuyên gia viết nội dung quảng cáo cho ngành ${industry}. Hãy viết nội dung ${tone}, lôi cuốn.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
  });

  const fullContent: string[] = [];
  const stream = OpenAIStream(response, {
    async onToken(token) {
      fullContent.push(token);
    },
    async onFinal() {
      const content = fullContent.join('');
      await prisma.chat.create({
        data: {
          email: email || '',
          content,
        },
      });
      await notifyIntegrations({ content });
    },
  });

  return new StreamingTextResponse(stream);
}
