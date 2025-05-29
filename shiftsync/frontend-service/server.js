const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3003;

// Absolute path to the public folder inside frontend-service
const publicPath = path.join(__dirname, 'public');

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[FRONTEND LOG] ${req.method} ${req.url}`);
  next();
});

// Serve static files from public
app.use(express.static(publicPath));

// Serve login.html on /login
app.get('/login', (req, res) => {
  res.sendFile(path.join(publicPath, 'login', 'login.html'));
});

// Admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(publicPath, 'admin', 'admin.html'));
});

// Employee page
app.get('/employee', (req, res) => {
  res.sendFile(path.join(publicPath, 'employee', 'employee.html'));
});

// Fallback 404
app.use((req, res) => {
  console.log(`[FRONTEND 404] ${req.method} ${req.url}`);
  res.status(404).send('404 - Not Found');
});

app.listen(PORT, () => {
  console.log(`Frontend running at http://localhost:${PORT}`);
});