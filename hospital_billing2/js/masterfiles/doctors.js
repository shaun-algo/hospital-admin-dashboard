// Doctors Module JavaScript - Dashboard Integration
class DoctorsManager {
  constructor() {
    console.log('DoctorsManager constructor called');
    this.doctorsData = [];
    this.currentDoctorId = null;
    this.baseApiUrl = 'http://localhost/hospital_billing2/api';
    this.init();
  }

  init() {
    this.loadDoctors();
    this.setupEventListeners();
  }

  setupEventListeners() {
    console.log('Setting up event listeners for Doctors module');

    // Add Doctor button
    const addBtn = document.getElementById('addDoctorBtn');
    console.log('Add button found:', addBtn);

    if (addBtn) {
      addBtn.onclick = () => {
        console.log('Add button clicked, opening modal');
        this.openModal('add');
      };
      console.log('Click event attached to add button');

      // Add a test attribute to verify the button is working
      addBtn.setAttribute('data-test', 'working');
      addBtn.title = 'Click to add new doctor (JavaScript loaded)';
    } else {
      console.error('Add button not found!');
    }

    // Setup table event delegation for action buttons
    const tbody = document.getElementById('doctorsTableBody');
    console.log('Table body found:', tbody);

    if (tbody) {
      tbody.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const action = button.getAttribute('data-action');
        const id = button.getAttribute('data-id');

        if (action === 'view') {
          this.openModal('view', this.doctorsData.find(d => d.doctorid == id));
        } else if (action === 'edit') {
          this.openModal('edit', this.doctorsData.find(d => d.doctorid == id));
        } else if (action === 'delete') {
          this.openModal('delete', this.doctorsData.find(d => d.doctorid == id));
        }
      });
      console.log('Table click event delegation set up');
    } else {
      console.error('Table body not found!');
    }
  }

  async loadDoctors() {
    const tbody = document.getElementById('doctorsTableBody');
    if (!tbody) {
      console.error('Table body not found for doctors');
      return;
    }

    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Loading doctors...</p></td></tr>';

    try {
      console.log('Loading doctors from:', `${this.baseApiUrl}/doctors.php?operation=getAllDoctors`);
      const response = await axios.get(`${this.baseApiUrl}/doctors.php?operation=getAllDoctors`);
      console.log('Doctors response:', response);

      if (response.data && Array.isArray(response.data)) {
        this.doctorsData = response.data;
        console.log('Doctors loaded successfully:', this.doctorsData.length, 'doctors');
        this.renderDoctorsTable();
      } else {
        console.warn('Doctors response is not an array:', response.data);
        this.doctorsData = [];
        this.renderDoctorsTable();
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
      this.doctorsData = [];
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger py-4"><i class="bi bi-exclamation-triangle me-2"></i>Failed to load doctors</td></tr>';
    }
  }

  renderDoctorsTable() {
    const tbody = document.getElementById('doctorsTableBody');
    if (!tbody) return;

    if (!this.doctorsData.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted"><i class="bi bi-inbox me-2"></i>No doctors found</td></tr>';
      return;
    }

    tbody.innerHTML = this.doctorsData.map(doctor => `
      <tr>
        <td><span class="badge bg-secondary">${doctor.doctorid}</span></td>
        <td><strong>${doctor.fullname}</strong></td>
        <td><span class="badge bg-info">${doctor.specialty}</span></td>
        <td><i class="bi bi-telephone me-1"></i>${doctor.contact_no || '-'}</td>
        <td><span class="badge bg-${this.getStatusColor(doctor.status)}">${doctor.status || 'Unknown'}</span></td>
        <td>
          <button class="btn btn-sm btn-outline-info me-1" data-id="${doctor.doctorid}" data-action="view" title="View Details">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-sm btn-outline-warning me-1" data-id="${doctor.doctorid}" data-action="edit" title="Edit Doctor">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" data-id="${doctor.doctorid}" data-action="delete" title="Delete Doctor">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  getStatusColor(status) {
    switch(status) {
      case 'Active': return 'success';
      case 'Inactive': return 'secondary';
      case 'Suspended': return 'warning';
      default: return 'secondary';
    }
  }

  openModal(mode = 'add', doctor = null) {
    console.log(`Opening modal in ${mode} mode`, doctor);

    // Remove any existing modals
    document.querySelectorAll('.modal').forEach(m => m.remove());
    console.log('Existing modals removed');

    let modalHtml = '';

    if (mode === 'delete') {
      modalHtml = `
        <div class="modal fade" id="doctorModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header text-danger">
                <h5 class="modal-title"><i class="bi bi-exclamation-triangle me-2"></i>Delete Doctor</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <div class="text-center mb-3">
                  <i class="bi bi-exclamation-triangle display-4 text-danger"></i>
                </div>
                <p class="text-center mb-3">Are you sure you want to delete <strong>${doctor.fullname}</strong>?</p>
                <div class="alert alert-warning">
                  <i class="bi bi-info-circle me-2"></i>
                  <strong>Warning:</strong> This action cannot be undone and will permanently remove the doctor from the system.
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  <i class="bi bi-x-circle me-2"></i>Cancel
                </button>
                <button type="button" class="btn btn-danger" id="confirmDeleteDoctor">
                  <i class="bi bi-trash me-2"></i>Delete
                </button>
              </div>
            </div>
          </div>
        </div>`;
    } else {
      modalHtml = `
        <div class="modal fade" id="doctorModal" tabindex="-1">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">
                  <i class="bi bi-${mode === 'edit' ? 'pencil-square' : mode === 'view' ? 'eye' : 'person-plus'} me-2"></i>
                  ${mode === 'edit' ? 'Edit' : mode === 'view' ? 'View' : 'Add'} Doctor
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <form id="doctorForm" novalidate>
                  <input type="hidden" id="doctorId" value="${doctor ? doctor.doctorid : ''}" />

      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label for="fullName" class="form-label">
              <i class="bi bi-person me-1"></i>Full Name
            </label>
            <input type="text" class="form-control" id="fullName"
                   value="${doctor ? doctor.fullname : ''}"
                   ${mode === 'view' ? 'readonly' : ''}
                   placeholder="Enter doctor's full name" required>
            <div class="invalid-feedback">Please enter the doctor's full name.</div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-3">
            <label for="specialty" class="form-label">
              <i class="bi bi-award me-1"></i>Specialty
            </label>
            <input type="text" class="form-control" id="specialty"
                   value="${doctor ? doctor.specialty : ''}"
                   ${mode === 'view' ? 'readonly' : ''}
                   placeholder="e.g., Cardiology, Neurology" required>
            <div class="invalid-feedback">Please enter the doctor's specialty.</div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label for="contactNo" class="form-label">
              <i class="bi bi-telephone me-1"></i>Contact Number
            </label>
            <input type="tel" class="form-control" id="contactNo"
                   value="${doctor ? doctor.contact_no : ''}"
                   ${mode === 'view' ? 'readonly' : ''}
                   placeholder="+63 XXX XXX XXXX" required>
            <div class="invalid-feedback">Please enter a valid contact number.</div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-3">
            <label for="status" class="form-label">
              <i class="bi bi-toggle-on me-1"></i>Status
            </label>
            <select class="form-select" id="status" ${mode === 'view' ? 'disabled' : ''}>
              <option value="Active" ${doctor && doctor.status === 'Active' ? 'selected' : ''}>🟢 Active</option>
              <option value="Inactive" ${doctor && doctor.status === 'Inactive' ? 'selected' : ''}>⚫ Inactive</option>
              <option value="Suspended" ${doctor && doctor.status === 'Suspended' ? 'selected' : ''}>🟡 Suspended</option>
            </select>
          </div>
        </div>
      </div>

      ${mode === 'view' ? `
        <div class="row">
          <div class="col-12">
            <div class="alert alert-info">
              <i class="bi bi-info-circle me-2"></i>
              <strong>Doctor ID:</strong> ${doctor.doctorid} |
              <strong>Created:</strong> ${new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      ` : ''}
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  <i class="bi bi-x-circle me-2"></i>Close
                </button>
                ${mode === 'view' ? '' : `
                  <button type="button" class="btn btn-primary" id="saveDoctorBtn">
                    <i class="bi bi-check-circle me-2"></i>${mode === 'edit' ? 'Update' : 'Save'}
                  </button>
                `}
      </div>
      </div>
      </div>
        </div>`;
    }

    // Append modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Get the modal element
    const modalElement = document.getElementById('doctorModal');
    if (modalElement) {
      if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        const modal = new bootstrap.Modal(modalElement, {
          backdrop: true,
          keyboard: true,
          focus: true
        });
        modal.show();

        if (mode === 'delete') {
          const confirmBtn = document.getElementById('confirmDeleteDoctor');
          if (confirmBtn) {
            confirmBtn.onclick = async () => {
              await this.deleteDoctor(doctor.doctorid);
            };
          }
        } else if (mode !== 'view') {
          const saveBtn = document.getElementById('saveDoctorBtn');
          if (saveBtn) {
            saveBtn.onclick = async () => {
              await this.saveDoctor(mode);
            };
          }
        }

        if (mode !== 'view' && mode !== 'delete') {
          this.setupFormValidation();
        }
      }
    }
  }

  setupFormValidation() {
    const form = document.getElementById('doctorForm');
    const inputs = form.querySelectorAll('.form-control[required]');

    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldValidation(input));
    });
  }

  validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
      field.classList.add('is-invalid');
      return false;
    }
    field.classList.remove('is-invalid');
    return true;
  }

  clearFieldValidation(field) {
    field.classList.remove('is-invalid');
  }

  async saveDoctor(mode) {
    const form = document.getElementById('doctorForm');
    const requiredFields = form.querySelectorAll('.form-control[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.showAlert('Please fill in all required fields.', 'warning');
      return;
    }

    const data = {
      fullname: document.getElementById('fullName').value.trim(),
      specialty: document.getElementById('specialty').value.trim(),
      contact_no: document.getElementById('contactNo').value.trim(),
      status: document.getElementById('status').value
    };

    if (mode === 'edit') {
      data.doctorid = document.getElementById('doctorId').value;
    }

    const formData = new FormData();
    formData.append('operation', mode === 'edit' ? 'updateDoctor' : 'insertDoctor');
    formData.append('json', JSON.stringify(data));

    const saveBtn = document.getElementById('saveDoctorBtn');
    const originalText = saveBtn.innerHTML;

    try {
      saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
      saveBtn.disabled = true;

      await axios.post(`${this.baseApiUrl}/doctors.php`, formData);
      this.showAlert(`Doctor ${mode === 'edit' ? 'updated' : 'added'} successfully!`, 'success');

      setTimeout(() => {
        const modalElement = document.getElementById('doctorModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
        this.loadDoctors();
      }, 2000);

    } catch (error) {
      console.error('Error saving doctor:', error);
      this.showAlert('Error saving doctor. Please try again.', 'danger');
    } finally {
      setTimeout(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
      }, 2000);
    }
  }

  async deleteDoctor(id) {
    const deleteBtn = document.getElementById('confirmDeleteDoctor');
    const originalText = deleteBtn.innerHTML;

    try {
      deleteBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Deleting...';
      deleteBtn.disabled = true;

      const formData = new FormData();
      formData.append('operation', 'deleteDoctor');
      formData.append('doctorid', id);

      await axios.post(`${this.baseApiUrl}/doctors.php`, formData);
      this.showAlert('Doctor deleted successfully!', 'success');

      setTimeout(() => {
        const modalElement = document.getElementById('doctorModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
        this.loadDoctors();
      }, 2000);

    } catch (error) {
      console.error('Error deleting doctor:', error);
      this.showAlert('Error deleting doctor. Please try again.', 'danger');
    } finally {
      setTimeout(() => {
        deleteBtn.innerHTML = originalText;
        deleteBtn.disabled = false;
      }, 2000);
    }
  }

  showAlert(message, type) {
    document.querySelectorAll('.alert').forEach(alert => alert.remove());

    const alertHtml = `
      <div class="alert alert-${type} alert-dismissible fade show position-fixed"
           style="top: 20px; right: 20px; z-index: 9999; min-width: 350px;">
        <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', alertHtml);

    setTimeout(() => {
      const alert = document.querySelector('.alert');
      if (alert) {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
      }
    }, 4000);
  }
}
