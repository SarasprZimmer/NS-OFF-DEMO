const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const OFF_FIELDS = [
  'code','product_name','brands','categories_tags',
  'labels_tags','image_front_url','ingredients_text',
  'stores_tags','nutrition_grades'
].join(',');

const OFF_HEADERS = {
  'Authorization': 'Basic ' + Buffer.from('off:off').toString('base64'),
  'User-Agent': 'NorthStarDemo/1.0 (northstarproject.org)'
};

app.use(express.static('public'));

app.get('/api/off/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'q is required' });
  try {
    const url = `https://search.openfoodfacts.org/search?q=${encodeURIComponent(q)}&langs=en&page_size=6&fields=${encodeURIComponent(OFF_FIELDS)}`;
    const r = await fetch(url, { headers: OFF_HEADERS });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/off/barcode/:code', async (req, res) => {
  try {
    const url = `https://world.openfoodfacts.net/api/v2/product/${req.params.code}.json?fields=${encodeURIComponent(OFF_FIELDS)}`;
    const r = await fetch(url, { headers: OFF_HEADERS });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`Running on ${PORT}`));
