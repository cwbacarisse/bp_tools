exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  const sessionId = event.queryStringParameters?.id;

  if (!sessionId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing session id' })
    };
  }

  try {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    const response = await fetch(`${redisUrl}/get/${sessionId}`, {
      headers: { Authorization: `Bearer ${redisToken}` }
    });

    if (!response.ok) {
      throw new Error(`Redis error: ${response.status}`);
    }

    const data = await response.json();

    // Upstash returns { result: "..." } — extract and parse the inner JSON string
    if (!data.result) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Session not found or expired' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: data.result // this is already the JSON string of the BRD data
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
