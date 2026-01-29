import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエストへの対応
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // ユニークなIDを生成
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    
    // Vercel KVに保存
    await kv.set(`paste:${id}`, {
      title: title || 'Untitled Script',
      content: content,
      date: new Date().toISOString()
    });

    // IDを返す
    res.status(200).json({ id });
  } catch (error) {
    console.error('Error saving paste:', error);
    res.status(500).json({ error: 'Failed to save paste' });
  }
}
