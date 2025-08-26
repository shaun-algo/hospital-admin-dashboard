class DoctorAssignmentManager {
  constructor(admissionId) {
    this.baseApiUrl = 'http://localhost/hospital_billing2/api/transactions/doctor_assignment.php';
    this.admissionId = admissionId;
    this.doctors = [];
    this.assignments = [];
    this.init = this.init.bind(this);
    this.setupEventListeners = this.setupEventListeners.bind(this);
    this.saveAssignment = this.saveAssignment.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.openModal = this.openModal.bind(this);
    this.loadDoctors = this.loadDoctors.bind(this);
    this.loadAssignments = this.loadAssignments.bind(this);
    this.deleteAssignment = this.deleteAssignment.bind(this);
    this.init();
  }

  init() {
    this.loadDoctors();
    this.loadAssignments();
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.body.addEventListener('click', (e) => {
      const target = e.target.closest('button');
      if (!target) return;

      const action = target.getAttribute('data-action');
      const id = target.getAttribute('data-id');

      if (target.id === 'addAssignmentBtn') {
        this.openModal('add');
        return;
      }

      if (!action || !id) return;

      if (action === 'delete') {
        this.openModal('delete', id);
      }
    });

    document.body.addEventListener('submit', async (e) => {
      if (e.target && e.target.id === 'doctorAssignmentForm') {
        e.preventDefault();
        await this.saveAssignment();
      }
    });
  }

  async loadDoctors() {
    try {
      const res = await axios.get('http://localhost/hospital_billing2/api/doctors.php', {
        params: { operation: 'getAllDoctors' }
      });
      if (res.data.error) throw new Error(res.data.error);
      this.doctors = Array.isArray(res.data) ? res.data : [];
      console.log('Doctors loaded:', this.doctors.length);
    } catch (err) {
      console.error('Error loading doctors:', err);
      this.doctors = [];
    }
  }

  async loadAssignments() {
    try {
      const res = await axios.get(this.baseApiUrl, {
        params: { operation: 'getAssignmentsByAdmission', admissionid: this.admissionId }
      });
      if (res.data.error) throw new Error(res.data.error);
      this.assignments = Array.isArray(res.data) ? res.data : [];
      this.renderAssignmentsTable();
    } catch (err) {
      console.error('Error loading assignments:', err);
      this.assignments = [];
      this.renderAssignmentsTable();
    }
  }

  renderAssignmentsTable() {
    const tbody = document.getElementById('doctorAssignmentTableBody');
    if (!tbody) return;

    if (!this.assignments.length) {
      tbody.innerHTML = `
        <tr><td colspan="4" class="text-center text-muted py-3">No doctor assignments found.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.assignments.map(a => `
      <tr>
        <td>${a.fullname}</td>
        <td>${a.role}</td>
        <td>${a.notes || ''}</td>
        <td>
          <button class="btn btn-sm btn-outline-danger" data-id="${a.assignmentid}" data-action="delete" title="Delete Assignment">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>`).join('');
  }

  openModal(mode, assignmentId = null) {
    const existingModal = document.getElementById('doctorAssignmentModal');
    if (existingModal) existingModal.remove();

    let modalHtml = '';

    if (mode === 'delete') {
      const assignment = this.assignments.find(a => a.assignmentid == assignmentId);
      modalHtml = this.getDeleteModalHtml(assignment);
    } else if (mode === 'add') {
      modalHtml = this.getFormModalHtml();
    }

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalEl = document.getElementById('doctorAssignmentModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    modalEl.addEventListener('hidden.bs.modal', () => modalEl.remove());

    if (mode === 'delete') {
      modalEl.querySelector('#confirmDeleteBtn').addEventListener('click', async () => {
        await this.deleteAssignment(assignmentId);
        modal.hide();
      });
    }
  }

  getFormModalHtml() {
    const title = 'Add Doctor Assignment';

    const doctorOptions = this.doctors.map(doc => `
      <option value="${doc.doctorid}">
        ${doc.fullname} (${doc.specialty})
      </option>`).join('');

    return `
      <div class="modal fade" id="doctorAssignmentModal" tabindex="-1" aria-labelledby="doctorAssignmentModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-md modal-dialog-centered">
          <div class="modal-content">
            <form id="doctorAssignmentForm" novalidate>
              <div class="modal-header bg-primary text-white">
                <h5 class="modal-title" id="doctorAssignmentModalLabel">${title}</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <input type="hidden" id="assignmentId" value="">
                <div class="mb-3">
                  <label for="doctorSelect" class="form-label">Select Doctor</label>
                  <select id="doctorSelect" class="form-select" required>
                    <option value="" disabled selected>Select a doctor</option>
                    ${doctorOptions}
                  </select>
                  <div class="invalid-feedback">Please select a doctor.</div>
                </div>
                <div class="mb-3">
                  <label for="roleInput" class="form-label">Role</label>
                  <input type="text" id="roleInput" class="form-control" placeholder="e.g., Attending Physician" value="" required />
                  <div class="invalid-feedback">Please enter the doctor's role.</div>
                </div>
                <div class="mb-3">
                  <label for="notesTextarea" class="form-label">Notes (optional)</label>
                  <textarea id="notesTextarea" class="form-control" rows="3"></textarea>
                </div>
              </div>
              <div class="modal-footer bg-light border-top">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>`;
  }

  getDeleteModalHtml(assignment) {
    return `
      <div class="modal fade" id="doctorAssignmentModal" tabindex="-1" aria-labelledby="doctorDeleteModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-danger text-white">
              <h5 class="modal-title" id="doctorDeleteModalLabel">Delete Doctor Assignment</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              Are you sure you want to delete the assignment of <strong>${assignment.fullname}</strong> as <em>${assignment.role}</em>?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  resetForm() {
    const form = document.getElementById('doctorAssignmentForm');
    if (form) form.reset();
    const idElem = document.getElementById('assignmentId');
    if (idElem) idElem.value = '';
  }

  async saveAssignment() {
    const doctorSelect = document.getElementById('doctorSelect');
    const roleInput = document.getElementById('roleInput');
    const notesInput = document.getElementById('notesTextarea');

    doctorSelect.classList.remove('is-invalid');
    roleInput.classList.remove('is-invalid');

    let valid = true;
    if (!doctorSelect.value) {
      doctorSelect.classList.add('is-invalid');
      valid = false;
    }
    if (!roleInput.value.trim()) {
      roleInput.classList.add('is-invalid');
      valid = false;
    }
    if (!valid) return;

    const payload = {
      admissionid: this.admissionId,
      doctorid: doctorSelect.value,
      role: roleInput.value.trim(),
      notes: (notesInput.value || '').trim()
    };

    const submitBtn = document.querySelector('#doctorAssignmentForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';

    try {
      const res = await axios.post(this.baseApiUrl, {
        operation: 'insertAssignment',
        json: JSON.stringify(payload)   // ✅ Always send JSON string
      });

      if (res.data.error) throw new Error(res.data.error);

      const modalEl = document.getElementById('doctorAssignmentModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();

      this.resetForm();
      await this.loadAssignments();
    } catch (err) {
      alert(`Failed to save assignment: ${err.message}`);
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }

  async deleteAssignment(assignmentId) {
    try {
      const res = await axios.post(this.baseApiUrl, {
        operation: 'deleteAssignment',
        assignmentid: assignmentId
      });

      if (res.data.error) throw new Error(res.data.error);
      await this.loadAssignments();
    } catch (err) {
      alert(`Failed to delete assignment: ${err.message}`);
      console.error(err);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest(".manage-assignments-btn");
    if (btn) {
      const admissionId = btn.dataset.admissionid;
      // pass module key + extra params to loader
      loadModule("doctor_assignment", { admissionId });
    }
  });
});

