const http = require('http');

// === GET /version ===
function testVersion() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/version',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    if (res.statusCode === 200) {
      console.log(' GET /version passed (auth-service)');
    } else {
      console.warn(` GET /version returned ${res.statusCode} (auth-service)`);
    }
  });

  req.on('error', (err) => {
    console.error(' GET /version failed (auth-service):', err.message);
  });

  req.end();
}

// === POST /login ===
function testLogin() {
  const loginData = JSON.stringify({
    staff_id: 'admin1', // Use a sample user from users.js
    password: 'adminpass'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': loginData.length
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log(' POST /login passed (auth-service)');
      } else {
        console.warn(` POST /login returned ${res.statusCode} (auth-service)`);
      }
    });
  });

  req.on('error', (err) => {
    console.error(' POST /login failed (auth-service):', err.message);
  });

  req.write(loginData);
  req.end();
}

testVersion();
setTimeout(testLogin, 1000);