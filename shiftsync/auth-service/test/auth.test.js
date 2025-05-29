const assert = require('assert');
const http = require('http');

describe('Auth API Tests', function () {

  it('GET /version should return 200', function (done) {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/version',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      assert.strictEqual(res.statusCode, 200);
      done();
    });

    req.on('error', (err) => done(err));
    req.end();
  });

  it('POST /login should return 200', function (done) {
    const loginData = JSON.stringify({
      staff_id: 'admin1',
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
      assert.strictEqual(res.statusCode, 200);
      done();
    });

    req.on('error', (err) => done(err));
    req.write(loginData);
    req.end();
  });

});