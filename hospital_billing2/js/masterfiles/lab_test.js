// Lab Test Module JavaScript - Dashboard Integration
class LabTestManager {
  constructor() {
    this.testsData = [];
    this.categoriesData = [];
    this.baseApiUrl = '/hospital_billing2/api';
    this.init();
  }

  init() {
    this.loadCategories();
    this.loadTests();
    this.setupEventListeners();
  }

  setupEventListeners() {
    console.log('Setting up event listeners for lab test module');

    // Add Test button
    const addBtn = document.getElementById('addTestBtn');
    console.log('Add button found:', addBtn);

    if (addBtn) {
      addBtn.onclick = () => {
        console.log('Add button clicked, opening modal');
        this.openModal('add');
      };
    } else {
      console.error('Add button not found!');
    }

    // Setup table event delegation for action buttons
    const tbody = document.getElementById('testsTableBody');
    if (tbody) {
      tbody.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const action = button.getAttribute('data-action');
        const id = button.getAttribute('data-id');

        if (action === 'view') {
          this.openModal('view', this.testsData.find(t => t.testid == id));
        } else if (action === 'edit') {
          this.openModal('edit', this.testsData.find(t => t.testid == id));
        } else if (action === 'delete') {
          this.openModal('delete', this.testsData.find(t => t.testid == id));
        }
      });
    }
  }

  async loadCategories() {
    try {
      console.log('Loading categories from:', `${this.baseApiUrl}/lab_test_category.php?operation=getAllCategories`);
      const response = await axios.get(`${this.baseApiUrl}/lab_test_category.php?operation=getAllCategories`);
      console.log('Categories response:', response);

      if (response.data && Array.isArray(response.data)) {
        this.categoriesData = response.data;
        console.log('Categories loaded successfully:', this.categoriesData.length, 'categories');
      } else {
        console.warn('Categories response is not an array:', response.data);
        this.categoriesData = [];
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      this.categoriesData = [];

      // Show error in the UI if there's a table body
      const tbody = document.getElementById('testsTableBody');
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger py-4"><i class="bi bi-exclamation-triangle me-2"></i>Failed to load categories</td></tr>';
      }
    }
  }

  async loadTests() {
    const tbody = document.getElementById('testsTableBody');
    if (!tbody) {
      console.error('Table body not found for tests');
      return;
    }

    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Loading tests...</p></td></tr>';

    try {
      console.log('Loading tests from:', `${this.baseApiUrl}/lab_test.php?operation=getAllTests`);
      const response = await axios.get(`${this.baseApiUrl}/lab_test.php?operation=getAllTests`);
      console.log('Tests response:', response);

      if (response.data && Array.isArray(response.data)) {
        this.testsData = response.data;
        console.log('Tests loaded successfully:', this.testsData.length, 'tests');
        this.renderTestsTable();
      } else {
        console.warn('Tests response is not an array:', response.data);
        this.testsData = [];
        this.renderTestsTable();
      }
    } catch (error) {
      console.error('Error loading tests:', error);
      this.testsData = [];
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger py-4"><i class="bi bi-exclamation-triangle me-2"></i>Failed to load tests</td></tr>';
    }
  }

  renderTestsTable() {
    const tbody = document.getElementById('testsTableBody');
    if (!tbody) return;

    if (!this.testsData.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted"><i class="bi bi-inbox me-2"></i>No tests found</td></tr>';
      return;
    }

    tbody.innerHTML = this.testsData.map(test => `
      <tr>
        <td><span class="badge bg-secondary">${test.testid}</span></td>
        <td><strong>${test.name}</strong></td>
        <td><span class="badge bg-info">${test.category_name || 'Unknown'}</span></td>
        <td>${test.description || '<span class="text-muted">No description</span>'}</td>
        <td><span class="badge bg-success">₱${parseFloat(test.price).toFixed(2)}</span></td>
        <td>
          <button class="btn btn-sm btn-outline-info me-1" data-id="${test.testid}" data-action="view" title="View Details">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-sm btn-outline-warning me-1" data-id="${test.testid}" data-action="edit" title="Edit Test">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" data-id="${test.testid}" data-action="delete" title="Delete Test">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  openModal(mode = 'add', test = null) {
    console.log(`Opening modal in ${mode} mode`, test);

    // Remove any existing modals
    document.querySelectorAll('.modal').forEach(m => m.remove());
    console.log('Existing modals removed');

    let modalHtml = '';

    if (mode === 'delete') {
      modalHtml = `
        <div class="modal fade" id="testModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header text-danger">
                <h5 class="modal-title"><i class="bi bi-exclamation-triangle me-2"></i>Delete Test</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <div class="text-center mb-3">
                  <i class="bi bi-exclamation-triangle display-4 text-danger"></i>
                </div>
                <p class="text-center mb-3">Are you sure you want to delete <strong>${test.name}</strong>?</p>
                <div class="alert alert-warning">
                  <i class="bi bi-info-circle me-2"></i>
                  <strong>Warning:</strong> This action cannot be undone and will permanently remove the test from the system.
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  <i class="bi bi-x-circle me-2"></i>Cancel
                </button>
                <button type="button" class="btn btn-danger" id="confirmDeleteTest">
                  <i class="bi bi-trash me-2"></i>Delete
                </button>
              </div>
            </div>
          </div>
        </div>`;
    } else {
      const categoryOptions = this.categoriesData.map(cat =>
        `<option value="${cat.labtestcatid}" ${test && test.categoryid == cat.labtestcatid ? 'selected' : ''}>${cat.name}</option>`
      ).join('');

      modalHtml = `
        <div class="modal fade" id="testModal" tabindex="-1">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">
                  <i class="bi bi-${mode === 'edit' ? 'pencil-square' : mode === 'view' ? 'eye' : 'flask'} me-2"></i>
                  ${mode === 'edit' ? 'Edit' : mode === 'view' ? 'View' : 'Add'} Test
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <form id="testForm" novalidate>
                  <input type="hidden" id="testId" value="${test ? test.testid : ''}" />

                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="testName" class="form-label">
                          <i class="bi bi-flask me-1"></i>Test Name
                        </label>
                        <input type="text" class="form-control" id="testName"
                               value="${test ? test.name : ''}"
                               ${mode === 'view' ? 'readonly' : ''}
                               placeholder="e.g., Complete Blood Count" required>
                        <div class="invalid-feedback">Please enter the test name.</div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="testCategory" class="form-label">
                          <i class="bi bi-diagram-3 me-1"></i>Category
                        </label>
                        <select class="form-select" id="testCategory" ${mode === 'view' ? 'disabled' : ''} required>
                          <option value="">Select Category</option>
                          ${categoryOptions}
                        </select>
                        <div class="invalid-feedback">Please select a category.</div>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="testPrice" class="form-label">
                          <i class="bi bi-currency-dollar me-1"></i>Price
                        </label>
                        <div class="input-group">
                          <span class="input-group-text">₱</span>
                          <input type="number" class="form-control" id="testPrice"
                                 step="0.01" min="0"
                                 value="${test ? test.price : ''}"
                                 ${mode === 'view' ? 'readonly' : ''}
                                 placeholder="0.00" required>
                        </div>
                        <div class="invalid-feedback">Please enter a valid price.</div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="testDescription" class="form-label">
                          <i class="bi bi-text-paragraph me-1"></i>Description
                        </label>
                        <textarea class="form-control" id="testDescription" rows="3"
                                  ${mode === 'view' ? 'readonly' : ''}
                                  placeholder="Optional description of the test">${test ? test.description : ''}</textarea>
                      </div>
                    </div>
                  </div>

                  ${mode === 'view' ? `
                    <div class="row">
                      <div class="col-12">
                        <div class="alert alert-info">
                          <i class="bi bi-info-circle me-2"></i>
                          <strong>Test ID:</strong> ${test.testid} |
                          <strong>Category ID:</strong> ${test.categoryid} |
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
                  <button type="button" class="btn btn-primary" id="saveTestBtn">
                    <i class="bi bi-check-circle me-2"></i>${mode === 'edit' ? 'Update' : 'Save'}
                  </button>
                `}
              </div>
            </div>
          </div>
        </div>`;
    }

    // Append modal to body
    console.log('About to append modal to body');
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    console.log('Modal HTML added to body');

    // Get the modal element
    const modalElement = document.getElementById('testModal');
    console.log('Modal element found:', modalElement);

    if (modalElement) {
      // Create and show Bootstrap modal
      if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        console.log('Bootstrap is available, creating modal instance');
        const modal = new bootstrap.Modal(modalElement, {
          backdrop: true,
          keyboard: true,
          focus: true
        });

        console.log('Bootstrap modal instance created:', modal);

        // Show the modal
        modal.show();
        console.log('Modal show() called');

        // Setup event listeners for the modal
        if (mode === 'delete') {
          const confirmBtn = document.getElementById('confirmDeleteTest');
          if (confirmBtn) {
            confirmBtn.onclick = async () => {
              await this.deleteTest(test.testid);
              modal.hide();
              this.loadTests();
            };
          }
        } else if (mode !== 'view') {
          const saveBtn = document.getElementById('saveTestBtn');
          if (saveBtn) {
            saveBtn.onclick = async () => {
              await this.saveTest(mode);
              modal.hide();
              this.loadTests();
            };
          }
        }

        // Setup form validation
        if (mode !== 'view' && mode !== 'delete') {
          this.setupFormValidation();
        }

      } else {
        console.error('Bootstrap Modal not available!');
      }
    } else {
      console.error('Modal element not found after adding to body!');
    }
  }

  setupFormValidation() {
    const form = document.getElementById('testForm');
    const inputs = form.querySelectorAll('.form-control[required], .form-select[required]');

    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldValidation(input));
      input.addEventListener('change', () => this.clearFieldValidation(input));
    });
  }

  validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
      field.classList.add('is-invalid');
      return false;
    }
    if (field.type === 'number' && field.value < field.min) {
      field.classList.add('is-invalid');
      return false;
    }
    field.classList.remove('is-invalid');
    return true;
  }

  clearFieldValidation(field) {
    field.classList.remove('is-invalid');
  }

  async saveTest(mode) {
    const form = document.getElementById('testForm');

    // Validate all required fields
    const requiredFields = form.querySelectorAll('.form-control[required], .form-select[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      return;
    }

    const data = {
      name: document.getElementById('testName').value.trim(),
      categoryid: document.getElementById('testCategory').value,
      price: parseFloat(document.getElementById('testPrice').value),
      description: document.getElementById('testDescription').value.trim()
    };

    if (mode === 'edit') {
      data.testid = document.getElementById('testId').value;
    }

    const formData = new FormData();
    formData.append('operation', mode === 'edit' ? 'updateTest' : 'insertTest');
    formData.append('json', JSON.stringify(data));

    try {
      // Show loading state
      const saveBtn = document.getElementById('saveTestBtn');
      const originalText = saveBtn.innerHTML;
      saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
      saveBtn.disabled = true;

      await axios.post(`${this.baseApiUrl}/lab_test.php`, formData);
      this.showAlert(`Test ${mode === 'edit' ? 'updated' : 'added'} successfully!`, 'success');
    } catch (error) {
      console.error('Error saving test:', error);
      this.showAlert('Error saving test. Please try again.', 'danger');
    } finally {
      // Restore button state
      const saveBtn = document.getElementById('saveTestBtn');
      saveBtn.innerHTML = originalText;
      saveBtn.disabled = false;
    }
  }

  async deleteTest(id) {
    try {
      const deleteBtn = document.getElementById('confirmDeleteTest');
      const originalText = deleteBtn.innerHTML;
      deleteBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Deleting...';
      deleteBtn.disabled = true;

      const formData = new FormData();
      formData.append('operation', 'deleteTest');
      formData.append('testid', id);

      await axios.post(`${this.baseApiUrl}/lab_test.php`, formData);
      this.showAlert('Test deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting test:', error);
      this.showAlert('Error deleting test. Please try again.', 'danger');
    } finally {
      const deleteBtn = document.getElementById('confirmDeleteTest');
      deleteBtn.innerHTML = originalText;
      deleteBtn.disabled = false;
    }
  }

  showAlert(message, type) {
    // Remove any existing alerts
    document.querySelectorAll('.alert').forEach(alert => alert.remove());

    const alertHtml = `
      <div class="alert alert-${type} alert-dismissible fade show position-fixed" style="top: 20px; right: 20px; z-index: 9999; min-width: 350px;">
        <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', alertHtml);

    // Auto-hide after 4 seconds
    setTimeout(() => {
      const alert = document.querySelector('.alert');
      if (alert) {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
      }
    }, 4000);
  }
}

// Initialize when DOM is loaded
// Note: This is now handled by the dashboard.js module loader
// document.addEventListener('DOMContentLoaded', () => {
//   new LabTestManager();
// });
