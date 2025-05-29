const http = require('http');

// Helper to make requests
function makeRequest(method, path, body = null, onSuccess, label) {
  const data = body ? JSON.stringify(body) : null;

  const options = {
    hostname: 'localhost',
    port: 3000,
    path,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
    }
  };

  const req = http.request(options, (res) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log(` ${method} ${path} passed (${label})`);
      onSuccess && onSuccess(res);
    } else {
      console.warn(` ${method} ${path} returned ${res.statusCode} (${label})`);
    }
  });

  req.on('error', (err) => {
    console.error(` ${method} ${path} failed:`, err.message);
  });

  if (data) req.write(data);
  req.end();
}

// === Run tests ===

makeRequest('GET', '/version', null, null, 'version check');

setTimeout(() => {
  makeRequest('GET', '/shifts', null, null, 'shifts list (OK if fails without DB)');
}, 500);

setTimeout(() => {
  makeRequest('POST', '/shifts', {
    shiftId: 'TST01',
    date: '2025-06-01',
    startTime: '10:00',
    endTime: '18:00'
  }, null, 'create shift (OK if fails without DB)');
}, 1000);