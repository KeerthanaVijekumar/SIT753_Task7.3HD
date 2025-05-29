const contentArea = document.getElementById('content-area');
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

const EMPLOYEE_API_URL = 'http://34.87.197.198:3000'; // your employee-service external IP

if (!token || role !== 'employee') {
  alert('Unauthorized. Redirecting to login...');
  window.location.href = '/login.html';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = '/login';
});

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.getAttribute('data-tab');
    if (tab === 'available') {
      loadAvailableShifts();
    } else if (tab === 'roster') {
      loadRoster();
    } else if (tab === 'clock') {
      contentArea.innerHTML = '<h3>Clock In / Out - Coming Soon</h3>';
    }
  });
});

// === Load Available Shifts ===
async function loadAvailableShifts() {
  const contentArea = document.getElementById('content-area');
  contentArea.innerHTML = '<h3>Loading Available Shifts...</h3>';

  const ADMIN_API_URL = 'http://34.116.118.12:3000';

  try {
    const res = await fetch(`${ADMIN_API_URL}/shifts/available`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to fetch available shifts");

    const shifts = await res.json();

    if (shifts.length === 0) {
      contentArea.innerHTML = '<p>No shifts available.</p>';
      return;
    }

    const table = document.createElement('table');
    table.innerHTML = `
      <tr>
        <th>Shift ID</th>
        <th>Date</th>
        <th>Start</th>
        <th>End</th>
        <th>Action</th>
      </tr>
      ${shifts.map(s => `
        <tr>
          <td>${s.shiftId}</td>
          <td>${s.date}</td>
          <td>${s.startTime}</td>
          <td>${s.endTime}</td>
          <td><button onclick="pickShift('${s.shiftId}')">Pick</button></td>
        </tr>
      `).join('')}
    `;
    contentArea.innerHTML = '<h3>Available Shifts</h3>';
    contentArea.appendChild(table);
  } catch (err) {
    contentArea.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

// === Pick Shift  ===
async function pickShift(shiftId) {
  const EMPLOYEE_API_URL = 'http://34.87.197.198:3000';
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${EMPLOYEE_API_URL}/allocate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ shift_id: shiftId })  // backend expects 'shift_id'
    });

    const result = await res.json();

    if (res.ok) {
      alert("Shift picked successfully!");
      loadAvailableShifts();
    } else {
      alert(result.message || "Failed to pick shift.");
    }
  } catch (err) {
    alert("Something went wrong while picking shift.");
    console.error(err);
  }
}


// === Load My Roster ===
async function loadRoster() {
  const EMPLOYEE_API_URL = 'http://34.87.197.198:3000';
  contentArea.innerHTML = '<h3>Loading Your Roster...</h3>';
  try {
    const res = await fetch(`${EMPLOYEE_API_URL}/roster`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Backend error: ${errorText}`);
    }

    const shifts = await res.json();

    if (!Array.isArray(shifts) || shifts.length === 0) {
      contentArea.innerHTML = '<p>You have no shifts allocated yet.</p>';
      return;
    }

    const table = document.createElement('table');
table.innerHTML = `
  <tr><th>Date</th><th>Start</th><th>End</th></tr>
  ${shifts.map(s => `
    <tr>
      <td>${s.date}</td>
      <td>${s.startTime}</td>
      <td>${s.endTime}</td>
    </tr>`).join('')}
`;


    contentArea.innerHTML = '<h3>My Roster</h3>';
    contentArea.appendChild(table);
  } catch (err) {
    contentArea.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

// Load default tab
document.querySelector('.tab[data-tab="available"]').click();