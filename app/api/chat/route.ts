import OpenAI from 'openai';
import { prisma } from '@/lib/db';
import { notifyIntegrations } from '@/lib/integrations';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { messages, industry, tone, email } = await req.json();

  const systemPrompt = `Bạn là chuyên gia viết nội dung quảng cáo cho ngành ${industry}. Hãy viết nội dung ${tone}, lôi cuốn.`;

  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
  });

  const content = chatCompletion.choices[0].message?.content || '';

  await prisma.chat.create({ data: { email: email || '', content } });
  await notifyIntegrations({ content });

  return new Response(JSON.stringify({ content }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
