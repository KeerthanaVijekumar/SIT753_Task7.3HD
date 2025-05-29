const http = require('http');

// === Helper to make requests ===
function makeRequest(method, path, token = null, body = null, label = '') {
  const data = body ? JSON.stringify(body) : null;

  const options = {
    hostname: 'localhost',
    port: 3000,
    path,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
    }
  };

  const req = http.request(options, (res) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log(` ${method} ${path} passed (${label})`);
    } else {
      console.warn(` ${method} ${path} returned ${res.statusCode} (${label})`);
    }
  });

  req.on('error', (err) => {
    console.error(` ${method} ${path} failed (${label}):`, err.message);
  });

  if (data) req.write(data);
  req.end();
}

// === Dummy JWT (won’t be verified but satisfies header check) ===
const dummyToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVtcGxveWVlMSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjkxODc4MDAsImV4cCI6MTk5MTg3ODAwfQ.abc123xyzfake';


// === Run Tests ===
makeRequest('GET', '/version', null, null, 'version check');

setTimeout(() => {
  makeRequest('GET', '/shifts/available', dummyToken, null, 'available shifts (OK if fails)');
}, 1000);

setTimeout(() => {
  makeRequest('POST', '/allocate', dummyToken, { shift_id: 'testshiftid123' }, 'allocate shift (OK if fails)');
}, 2000);