export default async function handler(req, res) {
  const API_BASE = 'https://api.jobopportunitiesapi.org/v1/jobs';
  const KEY = (process.env.JOB_OPPORTUNITIES_API_KEY || process.env.JOB_OPPORTUN_IES_API_KEY || process.env.JOB_API_KEY || process.env.JOA_API_KEY || '').trim();

  if (!KEY) {
    return res.status(500).json({ error: 'API key not set in env - add JOB_OPPORTUNITIES_API_KEY in Vercel' });
  }

  const query = req.url.includes('?')? req.url.split('?')[1] : 'country=DE&limit=20';
  const url = query? API_BASE + '?' + query : API_BASE;

  try {
    const r = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + KEY,
        'Content-Type': 'application/json'
      }
    });
    const data = await r.text();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    return res.status(r.status).send(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
