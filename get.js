import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエストへの対応
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).send('ID is required');
    }

    // Vercel KVから取得
    const paste = await kv.get(`paste:${id}`);
    
    if (!paste) {
      return res.status(404).send('-- Script not found --\n-- このスクリプトは存在しません --');
    }

    // プレーンテキストとして返す（エクスプロイト用）
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(paste.content);
  } catch (error) {
    console.error('Error fetching paste:', error);
    res.status(500).send('-- Internal Server Error --');
  }
}
