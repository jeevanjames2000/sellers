// pages/api/proxy-image.js
export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    console.error('Missing image URL in request');
    return res.status(400).json({ error: 'Missing image URL' });
  }

  try {
    console.log('Fetching image from:', url); // Debug: Log the URL being fetched
    const response = await fetch(url);
    if (!response.ok) {
      console.error('Upstream fetch failed:', response.status, response.statusText);
      throw new Error(`Upstream fetch failed: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    if (!contentType.startsWith('image/')) {
      console.error('Invalid content type:', contentType);
      throw new Error('Response is not an image');
    }

    const buffer = await response.arrayBuffer();
    console.log('Image fetched successfully, size:', buffer.byteLength); // Debug: Log success

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Failed to fetch image', details: error.message });
  }
}