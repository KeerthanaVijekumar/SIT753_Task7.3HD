document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const AUTH_API_URL = 'http://35.189.38.17:3000';

  const staffId = document.getElementById('staffId').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staff_id: staffId, password: password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      // Redirect to correct route based on role
      if (data.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/employee';
      }
    } else {
      document.getElementById('error').textContent = data.message || 'Login failed';
    }
  } catch (err) {
    document.getElementById('error').textContent = 'Network error';
  }
});