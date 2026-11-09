// Vercel Function (Node.js runtime, gaya klasik req/res).
// Semua endpoint /api/* diarahkan ke file ini oleh vercel.json (rewrite),
// lalu diteruskan ke logika API yang sama dengan server lokal (server.js).
const backend = require('../server.js');

module.exports = async (req, res) => {
  try {
    // Ambil nama route dari ?route=... (hasil rewrite) atau dari path asli sebagai cadangan.
    const u = new URL(req.url || '/', 'http://localhost');
    let route = u.searchParams.get('route');
    if (!route) route = u.pathname.replace(/^\/api\/?/, '').replace(/^index\/?/, '');
    route = String(route || '').replace(/^\/+|\/+$/g, '');

    if (!/^[a-zA-Z0-9/_-]{0,80}$/.test(route)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.end(JSON.stringify({ error: 'Endpoint tidak valid' }));
    }

    // Vercel mengisi req.body otomatis untuk JSON. Getter ini melempar error bila JSON rusak.
    if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT') {
      try { void req.body; } catch {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.end(JSON.stringify({ error: 'Format JSON tidak valid' }));
      }
    }

    return await backend.api(req, res, '/api/' + route);
  } catch (e) {
    console.error('[VLANesia:function]', e && e.stack || e);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    return res.end(JSON.stringify({ error: 'Fungsi server gagal dijalankan. Cek Vercel > Logs.' }));
  }
};
