class AdmissionManager {
  constructor() {
    this.apiUrl = 'http://localhost/hospital_billing2/api/transactions/admission.php';
    this.admissions = [];
    this.patients = [];
    this.doctors = [];
    this.init();
  }

  init() {
    this.loadPatients();
    this.loadDoctors();
    this.loadAdmissions();
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('addAdmissionBtn')?.addEventListener('click', () => this.openModal('add'));

    document.getElementById('admissionTableBody')?.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const id = btn.getAttribute('data-id');
      const action = btn.getAttribute('data-action');
      if (!id || !action) return;
      const admission = this.admissions.find(a => a.admissionid == id);
      const admission = this.admissions.find(a => String(a.admissionid) === String(id));
      if (!admission) return;

      this.openModal(action, admission);
    });
  }

  async loadPatients() {
    try {
      if (res.data.error) throw new Error(res.data.error);
      this.patients = Array.isArray(res.data) ? res.data : [];
      this.patients = Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error('Failed to load patients:', err);
      this.patients = [];
    }
  }

  async loadDoctors() {
    try {
      if (res.data.error) throw new Error(res.data.error);
      this.users = Array.isArray(res.data) ? res.data : [];
      console.log('Users loaded:', this.users.length);
    if (!tbody) return;
      console.error('Failed to load users:', err);
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">Loading admissions...</p>
    </td></tr>`;

    try {
      const res = await axios.get(this.apiUrl, { params: { operation: 'getAllAdmissions' } });
      if (res.data.error) throw new Error(res.data.error);
      this.admissions = Array.isArray(res.data) ? res.data : [];
      this.renderTable();
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4">${err.message}</td></tr>`;
    }
  }
      if (res.data.error) throw new Error(res.data.error);
      this.admissions = Array.isArray(res.data) ? res.data : [];
      this.renderTable();
        <td>${a.patient_name}</td>
        <td>${a.admission_date}</td>
        <td>${a.status}</td>
        <td>
          <button class="btn btn-sm btn-outline-info me-1" data-id="${a.admissionid}" data-action="view"><i class="bi bi-eye"></i></button>
          <button class="btn btn-sm btn-outline-warning me-1" data-id="${a.admissionid}" data-action="edit"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger" data-id="${a.admissionid}" data-action="delete"><i class="bi bi-trash"></i></button>
      </tr>
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No admissions found.</td></tr>`;
  }

  openModal(mode, admission = null) {
    document.querySelectorAll('#admissionModal').forEach(m => m.remove());

    let title = '';
        <td>${a.user_name}</td>

    if (mode === 'view') {
      title = 'View Admission';
      body = `
        <p><strong>Patient:</strong> ${admission.patient_name}</p>
        <p><strong>Doctor:</strong> ${admission.doctor_name}</p>
        <p><strong>Date:</strong> ${admission.admission_date}</p>
        <p><strong>Status:</strong> ${admission.status}</p>
      `;
    } else if (mode === 'delete') {
      title = 'Confirm Delete Admission';
      body = `<p>Are you sure you want to delete admission record for <strong>${admission.patient_name}</strong>?</p>`;
    // Remove existing modal if any
    } else {
      title = mode === 'add' ? 'Add Admission' : 'Edit Admission';
    let title = '';
    let body = '';
          <input type="hidden" id="admissionId" value="${admission ? admission.admissionid : ''}" />
          <div class="mb-3">
      title = 'View Admission';
      body = `
              <option value="">Select Patient</option>
        <p><strong>User:</strong> ${admission.user_name}</p>
            </select>
            <div class="invalid-feedback">Please select a patient.</div>
          </div>
          <div class="mb-3">
      title = 'Confirm Delete Admission';
      body = `<p>Are you sure you want to delete admission record for <strong>${admission.patient_name}</strong>?</p>`;
              <option value="">Select Doctor</option>
      title = mode === 'add' ? 'Add Admission' : 'Edit Admission';
      body = `
            <div class="invalid-feedback">Please select a doctor.</div>
          </div>
          <div class="mb-3">
            <label for="admissionDate" class="form-label">Admission Date</label>
            <input type="date" id="admissionDate" class="form-control" value="${admission ? admission.admission_date : new Date().toISOString().split('T')[0]}" required />
            <div class="invalid-feedback">Please select an admission date.</div>
          </div>
          <div class="mb-3">
            <label for="admissionStatus" class="form-label">Status</label>
            <select id="admissionStatus" class="form-select" required>
              <option value="">Select Status</option>
            <label for="userId" class="form-label">User</label>
            <select id="userId" class="form-select" required>
              <option value="">Select User</option>
              ${this.users.map(u => `<option value="${u.userid}" ${admission && admission.userid == u.userid ? 'selected' : ''}>${u.username}</option>`).join('')}
        </form>
            <div class="invalid-feedback">Please select a user.</div>
    }

    const modalHtml = `
      <div class="modal fade" id="admissionModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header ${mode === 'delete' ? 'bg-danger text-white' : 'bg-primary text-white'}">
              <h5 class="modal-title">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
              <option value="Admitted" ${admission && admission.status === 'Admitted' ? 'selected' : ''}>Admitted</option>
              <option value="Discharged" ${admission && admission.status === 'Discharged' ? 'selected' : ''}>Discharged</option>
              <option value="Transferred" ${admission && admission.status === 'Transferred' ? 'selected' : ''}>Transferred</option>
              <option value="Pending" ${admission && admission.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              ${(mode === 'add' || mode === 'edit') ? `<button type="button" class="btn btn-primary" id="saveAdmissionBtn">${mode === 'add' ? 'Add' : 'Update'}</button>` : ''}
              ${mode === 'delete' ? `<button type="button" class="btn btn-danger" id="confirmDeleteAdmissionBtn">Delete</button>` : ''}
            </div>
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modalEl = document.getElementById('admissionModal');
              <h5 class="modal-title">${title}</h5>
    bsModal.show();

            <div class="modal-body">${body}</div>

    if (mode === 'add' || mode === 'edit') {
      document.getElementById('saveAdmissionBtn').addEventListener('click', () => this.saveAdmission(mode, bsModal));
    } else if (mode === 'delete') {
      document.getElementById('confirmDeleteAdmissionBtn').addEventListener('click', () => this.deleteAdmission(admission.admissionid, bsModal));
    }
  }

    const form = document.getElementById('admissionForm');
    if (!form.checkValidity()) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    const patientId = form.querySelector('#patientId').value;
    const doctorId = form.querySelector('#doctorId').value;
      document.getElementById('saveAdmissionBtn').addEventListener('click', () => this.saveAdmission(mode, modal));
    if (!patientId || !doctorId) {
      document.getElementById('confirmDeleteAdmissionBtn').addEventListener('click', () => this.deleteAdmission(admission.admissionid, modal));
      if (!doctorId) form.querySelector('#doctorId').classList.add('is-invalid');
      return;
    }

    const data = {
      admissionid: form.querySelector('#admissionId').value || null,
      patientid: patientId,
      doctorid: doctorId,
      admission_date: form.querySelector('#admissionDate').value,
    
    const patientSelect = form.querySelector('#patientId');
    const userSelect = form.querySelector('#userId');
    
    if (!patientSelect.value) {
      patientSelect.classList.add('is-invalid');
      return;
    }
    
    if (!userSelect.value) {
      userSelect.classList.add('is-invalid');
      });

    

      this.showAlert(`Admission ${mode === 'edit' ? 'updated' : 'added'} successfully!`, 'success');
      patientid: patientSelect.value,
      userid: userSelect.value,
    } catch (err) {
      if (err.response) {
        this.showAlert(`Server error: ${err.response.data?.error || err.response.statusText}`, 'danger');
        this.showAlert('Network error: no response from server', 'danger');
      } else {
        this.showAlert(`Error: ${err.message}`, 'danger');
      }
      console.error(err);
    }

  async deleteAdmission(id, modal) {
    try {
      alert(`Failed to save admission: ${err.message}`);
      if (res.data.success === false) throw new Error(res.data.error);
      this.showAlert('Admission deleted successfully!', 'success');
      modal.hide();
  async deleteAdmission(id, modal) {
    } catch (err) {
      const res = await axios.post(this.apiUrl, { operation: 'deleteAdmission', admissionid: id });
    }

  showAlert(message, type = 'info') {
    document.querySelectorAll('.alert.position-fixed').forEach(e => e.remove());
    const icons = { success: 'check-circle', danger: 'exclamation-triangle', warning: 'exclamation-circle', info: 'info-circle' };
    const icon = icons[type] || icons.info;

    const alertHtml = `
      <div class="alert alert-${type} alert-dismissible fade show position-fixed"
           style="top: 20px; right: 20px; z-index: 1055; min-width: 350px;">
        <i class="bi bi-${icon} me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', alertHtml);

    const alertEl = document.querySelector('.alert.position-fixed');
    if (alertEl && window.bootstrap?.Alert) {
      const bsAlert = new bootstrap.Alert(alertEl);
      setTimeout(() => bsAlert.close(), 4000);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new AdmissionManager());
