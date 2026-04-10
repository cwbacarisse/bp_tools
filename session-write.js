exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // CORS headers so Claude Code scripts and the BRD tool can call this
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const body = JSON.parse(event.body);

    // Generate a short unique session ID
    const sessionId = 'brd_' + Math.random().toString(36).slice(2, 9);

    // Store in Upstash Redis via REST API — expires after 24 hours
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    const response = await fetch(`${redisUrl}/set/${sessionId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redisToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        value: JSON.stringify(body),
        ex: 86400 // 24 hour expiry
      })
    });

    if (!response.ok) {
      throw new Error(`Redis error: ${response.status}`);
    }

    // Return the session ID and a ready-to-use URL
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId,
        url: `https://bp-brd.netlify.app/?session=${sessionId}`
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
