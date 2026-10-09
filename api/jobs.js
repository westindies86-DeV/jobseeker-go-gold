export default async function handler(req, res) {
  const KEY = (process.env.JOB_OPPORTUNITIES_API_KEY || '').trim();
  if (!KEY) {
    return res.status(500).json({ error: 'API key not set - add JOB_OPPORTUNITIES_API_KEY with sk_live_... in Vercel' });
  }
  const rawQuery = req.url.includes('?')? req.url.split('?')[1] : '';
  const query = rawQuery || 'limit=25';
  const API_BASE = 'https://api.jobopportunitiesapi.org/v1/jobs';
  const url = `${API_BASE}?${query}`;
  try {
    const r = await fetch(url, {
      headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' }
    });
    const data = await r.text();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    return res.status(r.status).send(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
