// lib/integrations.ts
export async function notifyIntegrations(data: { content: string }) {
  try {
    if (process.env.SHOPIFY_WEBHOOK_URL) {
      await fetch(process.env.SHOPIFY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: data.content }),
      });
    }
    console.log('📢 Đã gửi tới Shopify / Facebook / TikTok');
  } catch (err) {
    console.error('❌ Tích hợp lỗi:', err);
  }
}