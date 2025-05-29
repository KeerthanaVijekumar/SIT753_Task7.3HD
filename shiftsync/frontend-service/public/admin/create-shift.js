console.log("create-shift.js loaded");

const ADMIN_API_URL = 'http://34.116.118.12:3000';  

function attachCreateShiftListener() {
  console.log("Attaching submit listener...");
  const form = document.getElementById('createShiftForm');
  const messageDiv = document.getElementById('message');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // prevent default form submit and page reload
    console.log("Submit intercepted, sending POST");

    const shiftId = document.getElementById('shiftId').value.trim();
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const token = localStorage.getItem('token'); 

    messageDiv.style.color = 'black';
    messageDiv.textContent = 'Creating shift...';

    try {
      const response = await fetch(`${ADMIN_API_URL}/shifts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ shiftId, date, startTime, endTime })
      });

      if (response.ok) {
        messageDiv.style.color = 'green';
        messageDiv.textContent = 'Shift created successfully!';
        //form.reset();

        alert('Shift created successfully!');

        // Switch to the "View Shifts" tab
        if (window.showTab) {
          window.showTab('view-shifts');
        } else {
          console.warn('showTab function not found. Cannot switch tabs automatically.');
        }
      } else {
        const data = await response.json();
        messageDiv.style.color = 'red';
        messageDiv.textContent = data.message || 'Failed to create shift.';
      }
    } catch (err) {
      console.error("Network error:", err);
      messageDiv.style.color = 'red';
      messageDiv.textContent = 'Network error.';
    }
  });
}

// Attach listener immediately after loading
document.addEventListener('DOMContentLoaded', () => {
  attachCreateShiftListener();
});