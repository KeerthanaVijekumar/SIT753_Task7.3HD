(() => {
  const ADMIN_API_URL = 'http://34.116.118.12:3000';

  async function loadPickedShifts() {
    const container = document.getElementById('pickedShifts');
    container.innerHTML = '';

    try {
      const res = await fetch(`${ADMIN_API_URL}/picked-shifts`);
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<p>No picked shifts yet.</p>';
        return;
      }

      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      table.innerHTML = `
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Employee ID</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Shift ID</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Date</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Start Time</th>
            <th style="border: 1px solid #ddd; padding: 8px;">End Time</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Status</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(s => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${s.employee_id}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${s.shift_id}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${s.date}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${s.startTime}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${s.endTime}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${s.approved ? 'Approved' : 'Pending'}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">
                  <button style="margin-right: 5px;">Approve</button>
                  <button>Decline</button>
              </td>
            </tr>`).join('')}
        </tbody>
      `;

      container.innerHTML = '<h3>Picked Shifts</h3>';
      container.appendChild(table);

    } catch (err) {
      container.innerHTML = `<p style="color:red;">Failed to load picked shifts.</p>`;
      console.error(err);
    }
  }

  // Expose only the main function globally
  window.loadPickedShifts = loadPickedShifts;
})();
