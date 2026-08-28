export default async function handler(req, res) {
  const API_BASE = 'https://api.jobopportunitiesapi.org/public/jobs';
  const KEY = process.env.JOB_API_KEY || process.env.API_KEY;
  
  if (!KEY) {
    return res.status(500).json({ error: 'API key not set in env' });
  }

  const query = req.url.includes('?') ? req.url.split('?')[1] : '';
  const url = `${API_BASE}?${query}`;

  try {
    const r = await fetch(url, { headers: { 'X-API-Key': KEY } });
    const data = await r.text();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.status(r.status).send(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
