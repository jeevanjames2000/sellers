export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const imageRes = await fetch(url);
    if (!imageRes.ok) throw new Error(`Failed to fetch image: ${imageRes.status}`);

    // Forward headers
    res.setHeader('Content-Type', imageRes.headers.get('Content-Type'));
    
    // Stream the image data
    const imageBuffer = await imageRes.arrayBuffer();
    return res.end(Buffer.from(imageBuffer));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}