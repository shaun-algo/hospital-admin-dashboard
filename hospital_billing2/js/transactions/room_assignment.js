class RoomAssignmentManager {
  constructor() {
    this.apiUrl = "http://localhost/hospital_billing2/api/transactions/room_assignment.php";
    this.assignments = [];
    this.admissions = [];
    this.rooms = [];
    this.init();
  }

  async init() {
    await Promise.all([
      this.loadAssignments(),
      this.loadAdmissions(),
      this.loadRooms()
    ]);
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById("addAssignmentBtn").addEventListener("click", () => {
      document.getElementById("assignmentId").value = "";
      document.getElementById("assignmentForm").reset();
      new bootstrap.Modal(document.getElementById("assignmentModal")).show();
    });

    document.getElementById("assignmentForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      this.saveAssignment();
    });

    document.getElementById("assignmentTableBody").addEventListener("click", e => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const id = btn.getAttribute("data-id");
      const action = btn.getAttribute("data-action");
      if (!id || !action) return;

      if (action === "edit") {
        this.editAssignment(Number(id));
      } else if (action === "delete") {
        this.deleteAssignment(Number(id));
      }
    });
  }

  async loadAssignments() {
    try {
      const res = await axios.get(this.apiUrl);
      this.assignments = Array.isArray(res.data) ? res.data : [];
      this.renderTable();
    } catch (err) {
      console.error("Failed to load assignments:", err);
      this.assignments = [];
    }
  }

  async loadAdmissions() {
    try {
      const res = await axios.get("http://localhost/hospital_billing2/api/transactions/admission.php", {
        params: { operation: "getAllAdmissions" }
      });
      this.admissions = Array.isArray(res.data) ? res.data : [];
      const admissionSelect = document.getElementById("admissionSelect");
      admissionSelect.innerHTML = `<option value="">-- Select Admission --</option>` + this.admissions.map(a => `<option value="${a.admissionid}">#${a.admissionid} - ${a.patient_name}</option>`).join("");
    } catch (err) {
      console.error("Failed to load admissions:", err);
    }
  }

  async loadRooms() {
    try {
      const res = await axios.get("http://localhost/hospital_billing2/api/transactions/room.php", { params: { operation: 'getAllRooms' } });
      this.rooms = Array.isArray(res.data) ? res.data : [];
      const roomSelect = document.getElementById("roomSelect");
      roomSelect.innerHTML = `<option value="">-- Select Room --</option>` + this.rooms.map(r => `<option value="${r.room_no}">${r.room_no} - ${r.category_name}</option>`).join("");
    } catch (err) {
      console.error("Failed to load rooms:", err);
    }
  }

  renderTable() {
    const tbody = document.getElementById("assignmentTableBody");
    if (!tbody) return;

    if (!this.assignments.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No assignments found.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.assignments.map(a => `
      <tr>
        <td>${a.assignment_id}</td>
        <td>#${a.admissionid} - ${a.patient_name || 'Unknown'}</td>
        <td>${a.room_no} (${a.category_name || 'Unknown'})</td>
        <td>${a.assigned_date}</td>
        <td>
          <div style="display: flex; gap: 8px; flex-wrap: nowrap;">
            <button class="btn btn-sm btn-warning" title="Edit Assignment" data-id="${a.assignment_id}" data-action="edit">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger" title="Delete Assignment" data-id="${a.assignment_id}" data-action="delete">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join("");
  }

  async saveAssignment() {
    const form = document.getElementById("assignmentForm");
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const data = {
      assignment_id: document.getElementById("assignmentId").value || null,
      admissionid: document.getElementById("admissionSelect").value,
      room_no: document.getElementById("roomSelect").value,
      assigned_date: document.getElementById("assignedDate").value
    };

    try {
      if (data.assignment_id) {
        await axios.put(this.apiUrl, data);
      } else {
        await axios.post(this.apiUrl, data);
      }
      bootstrap.Modal.getInstance(document.getElementById("assignmentModal")).hide();
      this.loadAssignments();
      form.classList.remove("was-validated");
    } catch (err) {
      console.error("Failed to save assignment:", err);
      alert("Error saving assignment.");
    }
  }

  editAssignment(id) {
    const assignment = this.assignments.find(a => a.assignment_id == id);
    if (!assignment) return;

    document.getElementById("assignmentId").value = assignment.assignment_id;
    document.getElementById("admissionSelect").value = assignment.admissionid;
    document.getElementById("roomSelect").value = assignment.room_no;
    document.getElementById("assignedDate").value = assignment.assigned_date;

    new bootstrap.Modal(document.getElementById("assignmentModal")).show();
  }

  async deleteAssignment(id) {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await axios.delete(this.apiUrl, { data: { assignment_id: id } });
      this.loadAssignments();
    } catch (err) {
      console.error("Failed to delete assignment:", err);
      alert("Error deleting assignment.");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => new RoomAssignmentManager());
