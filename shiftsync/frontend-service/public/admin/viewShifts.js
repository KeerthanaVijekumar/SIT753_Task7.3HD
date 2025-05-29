console.log("viewShifts.js loaded");

async function loadShifts() {
  const tbody = document.querySelector('#shiftsTable tbody');
  const noShiftsMsg = document.getElementById('noShiftsMsg');

  tbody.innerHTML = '';
  noShiftsMsg.style.display = 'none';

  const ADMIN_API_URL = 'http://34.116.118.12:3000';

  try {
    const response = await fetch(`${ADMIN_API_URL}/shifts`);
    if (!response.ok) throw new Error('Failed to fetch shifts');
    const shifts = await response.json();

    if (shifts.length === 0) {
      noShiftsMsg.style.display = 'block';
      return;
    }

    shifts.forEach((shift) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td style="border: 1px solid #ddd; padding: 8px;">${shift.shiftId}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${shift.date}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${shift.startTime}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${shift.endTime}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">
          <button onclick="enableEdit(this)">Edit</button>
          <button onclick="deleteShift('${shift.shiftId}')">Delete</button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading shifts:", error);
    noShiftsMsg.textContent = 'Error loading shifts.';
    noShiftsMsg.style.display = 'block';
  }
}

async function deleteShift(shiftId) {
  const ADMIN_API_URL = 'http://34.116.118.12:3000';

  if (confirm(`Delete shift ${shiftId}?`)) {
    try {
      const res = await fetch(`${ADMIN_API_URL}/shifts/${shiftId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Deleted");
        loadShifts();
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting");
    }
  }
}

function enableEdit(button) {
  const row = button.closest('tr');
  const cells = row.querySelectorAll('td');
  const shiftId = cells[0].textContent;

  // Replace date, startTime, endTime with inputs
  const date = cells[1].textContent;
  const start = cells[2].textContent;
  const end = cells[3].textContent;

  cells[1].innerHTML = `<input type="date" value="${date}">`;
  cells[2].innerHTML = `<input type="time" value="${start}">`;
  cells[3].innerHTML = `<input type="time" value="${end}">`;

  // Replace buttons
  cells[4].innerHTML = `
    <button onclick="saveEdit(this, '${shiftId}')">Save</button>
    <button onclick="loadShifts()">Cancel</button>
  `;
}

async function saveEdit(button, shiftId) {
  const row = button.closest('tr');
  const inputs = row.querySelectorAll('input');

  const updatedShift = {
    date: inputs[0].value,
    startTime: inputs[1].value,
    endTime: inputs[2].value,
  };

  const ADMIN_API_URL = 'http://34.116.118.12:3000';

  try {
    const res = await fetch(`${ADMIN_API_URL}/shifts/${shiftId}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedShift),
    });

    if (res.ok) {
      alert("Shift updated");
      loadShifts();
    } else {
      alert("Update failed");
    }
  } catch (err) {
    console.error("Edit error:", err);
    alert("Error updating shift");
  }
}

window.loadShifts = loadShifts;
window.deleteShift = deleteShift;