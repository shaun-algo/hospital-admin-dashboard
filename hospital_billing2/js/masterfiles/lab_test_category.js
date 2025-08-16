// Lab Test Category Module JavaScript - Dashboard Integration
class LabTestCategoryManager {
  constructor() {
    this.categoriesData = [];
    this.baseApiUrl = '/hospital_billing2/api';
    this.init();
  }

  init() {
    this.loadCategories();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Add Category button
    const addBtn = document.getElementById('addCategoryBtn');
    if (addBtn) {
      addBtn.onclick = () => this.openModal('add');
    }

    // Setup table event delegation for action buttons
    const tbody = document.getElementById('categoriesTableBody');
    if (tbody) {
      tbody.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const action = button.getAttribute('data-action');
        const id = button.getAttribute('data-id');

        if (action === 'view') {
          this.openModal('view', this.categoriesData.find(c => c.labtestcatid == id));
        } else if (action === 'edit') {
          this.openModal('edit', this.categoriesData.find(c => c.labtestcatid == id));
        } else if (action === 'delete') {
          this.openModal('delete', this.categoriesData.find(c => c.labtestcatid == id));
        }
      });
    }
  }

  async loadCategories() {
    const tbody = document.getElementById('categoriesTableBody');
    if (!tbody) {
      console.error('Table body not found for categories');
      return;
    }

    tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Loading categories...</p></td></tr>';

    try {
      console.log('Loading categories from:', `${this.baseApiUrl}/lab_test_category.php?operation=getAllCategories`);
      const response = await axios.get(`${this.baseApiUrl}/lab_test_category.php?operation=getAllCategories`);
      console.log('Categories response:', response);

      if (response.data && Array.isArray(response.data)) {
        this.categoriesData = response.data;
        console.log('Categories loaded successfully:', this.categoriesData.length, 'categories');
        this.renderCategoriesTable();
      } else {
        console.warn('Categories response is not an array:', response.data);
        this.categoriesData = [];
        this.renderCategoriesTable();
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      this.categoriesData = [];
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger py-4"><i class="bi bi-exclamation-triangle me-2"></i>Failed to load categories</td></tr>';
    }
  }

  renderCategoriesTable() {
    const tbody = document.getElementById('categoriesTableBody');
    if (!tbody) return;

    if (!this.categoriesData.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted"><i class="bi bi-inbox me-2"></i>No categories found</td></tr>';
      return;
    }

    tbody.innerHTML = this.categoriesData.map(category => `
      <tr>
        <td><span class="badge bg-secondary">${category.labtestcatid}</span></td>
        <td><strong>${category.name}</strong></td>
        <td>${category.description || '<span class="text-muted">No description</span>'}</td>
        <td><span class="badge bg-success">₱${parseFloat(category.handling_fee).toFixed(2)}</span></td>
        <td><span class="badge bg-info">${category.turnaround_days} days</span></td>
        <td>
          <button class="btn btn-sm btn-outline-info me-1" data-id="${category.labtestcatid}" data-action="view" title="View Details">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-sm btn-outline-warning me-1" data-id="${category.labtestcatid}" data-action="edit" title="Edit Category">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" data-id="${category.labtestcatid}" data-action="delete" title="Delete Category">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  openModal(mode = 'add', category = null) {
    console.log(`Opening modal in ${mode} mode`, category);

    // Remove any existing modals
    document.querySelectorAll('.modal').forEach(m => m.remove());
    console.log('Existing modals removed');

    let modalHtml = '';

    if (mode === 'delete') {
      modalHtml = `
        <div class="modal fade" id="categoryModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header text-danger">
                <h5 class="modal-title"><i class="bi bi-exclamation-triangle me-2"></i>Delete Category</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <div class="text-center mb-3">
                  <i class="bi bi-exclamation-triangle display-4 text-danger"></i>
                </div>
                <p class="text-center mb-3">Are you sure you want to delete <strong>${category.name}</strong>?</p>
                <div class="alert alert-warning">
                  <i class="bi bi-info-circle me-2"></i>
                  <strong>Warning:</strong> This action cannot be undone and will permanently remove the category from the system.
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  <i class="bi bi-x-circle me-2"></i>Cancel
                </button>
                <button type="button" class="btn btn-danger" id="confirmDeleteCategory">
                  <i class="bi bi-trash me-2"></i>Delete
                </button>
              </div>
            </div>
          </div>
        </div>`;
    } else {
      modalHtml = `
        <div class="modal fade" id="categoryModal" tabindex="-1">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">
                  <i class="bi bi-${mode === 'edit' ? 'pencil-square' : mode === 'view' ? 'eye' : 'diagram-3'} me-2"></i>
                  ${mode === 'edit' ? 'Edit' : mode === 'view' ? 'View' : 'Add'} Category
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <form id="categoryForm" novalidate>
                  <input type="hidden" id="categoryId" value="${category ? category.labtestcatid : ''}" />

                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="categoryName" class="form-label">
                          <i class="bi bi-tag me-1"></i>Category Name
                        </label>
                        <input type="text" class="form-control" id="categoryName"
                               value="${category ? category.name : ''}"
                               ${mode === 'view' ? 'readonly' : ''}
                               placeholder="e.g., Blood Tests, Imaging" required>
                        <div class="invalid-feedback">Please enter the category name.</div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="handlingFee" class="form-label">
                          <i class="bi bi-currency-dollar me-1"></i>Handling Fee
                        </label>
                        <div class="input-group">
                          <span class="input-group-text">₱</span>
                          <input type="number" class="form-control" id="handlingFee"
                                 step="0.01" min="0"
                                 value="${category ? category.handling_fee : ''}"
                                 ${mode === 'view' ? 'readonly' : ''}
                                 placeholder="0.00" required>
                        </div>
                        <div class="invalid-feedback">Please enter a valid handling fee.</div>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="turnaroundDays" class="form-label">
                          <i class="bi bi-calendar-check me-1"></i>Turnaround Days
                        </label>
                        <input type="number" class="form-control" id="turnaroundDays"
                               min="1"
                               value="${category ? category.turnaround_days : ''}"
                               ${mode === 'view' ? 'readonly' : ''}
                               placeholder="e.g., 3" required>
                        <div class="invalid-feedback">Please enter the turnaround days.</div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="categoryDescription" class="form-label">
                          <i class="bi bi-text-paragraph me-1"></i>Description
                        </label>
                        <textarea class="form-control" id="categoryDescription" rows="3"
                                  ${mode === 'view' ? 'readonly' : ''}
                                  placeholder="Optional description of the category">${category ? category.description : ''}</textarea>
                      </div>
                    </div>
                  </div>

                  ${mode === 'view' ? `
                    <div class="row">
                      <div class="col-12">
                        <div class="alert alert-info">
                          <i class="bi bi-info-circle me-2"></i>
                          <strong>Category ID:</strong> ${category.labtestcatid} |
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
                  <button type="button" class="btn btn-primary" id="saveCategoryBtn">
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
    const modalElement = document.getElementById('categoryModal');
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
          const confirmBtn = document.getElementById('confirmDeleteCategory');
          if (confirmBtn) {
            confirmBtn.onclick = async () => {
              await this.deleteCategory(category.labtestcatid);
              modal.hide();
              this.loadCategories();
            };
          }
        } else if (mode !== 'view') {
          const saveBtn = document.getElementById('saveCategoryBtn');
          if (saveBtn) {
            saveBtn.onclick = async () => {
              await this.saveCategory(mode);
              modal.hide();
              this.loadCategories();
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
    const form = document.getElementById('categoryForm');
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

  async saveCategory(mode) {
    const form = document.getElementById('categoryForm');

    // Validate all required fields
    const requiredFields = form.querySelectorAll('.form-control[required]');
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
      name: document.getElementById('categoryName').value.trim(),
      description: document.getElementById('categoryDescription').value.trim(),
      handling_fee: parseFloat(document.getElementById('handlingFee').value),
      turnaround_days: parseInt(document.getElementById('turnaroundDays').value)
    };

    if (mode === 'edit') {
      data.labtestcatid = document.getElementById('categoryId').value;
    }

    const formData = new FormData();
    formData.append('operation', mode === 'edit' ? 'updateCategory' : 'insertCategory');
    formData.append('json', JSON.stringify(data));

    try {
      // Show loading state
      const saveBtn = document.getElementById('saveCategoryBtn');
      const originalText = saveBtn.innerHTML;
      saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
      saveBtn.disabled = true;

      await axios.post(`${this.baseApiUrl}/lab_test_category.php`, formData);
      this.showAlert(`Category ${mode === 'edit' ? 'updated' : 'added'} successfully!`, 'success');
    } catch (error) {
      console.error('Error saving category:', error);
      this.showAlert('Error saving category. Please try again.', 'danger');
    } finally {
      // Restore button state
      const saveBtn = document.getElementById('saveCategoryBtn');
      saveBtn.innerHTML = originalText;
      saveBtn.disabled = false;
    }
  }

  async deleteCategory(id) {
    try {
      const deleteBtn = document.getElementById('confirmDeleteCategory');
      const originalText = deleteBtn.innerHTML;
      deleteBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Deleting...';
      deleteBtn.disabled = true;

      const formData = new FormData();
      formData.append('operation', 'deleteCategory');
      formData.append('labtestcatid', id);

      await axios.post(`${this.baseApiUrl}/lab_test_category.php`, formData);
      this.showAlert('Category deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting category:', error);
      this.showAlert('Error deleting category. Please try again.', 'danger');
    } finally {
      const deleteBtn = document.getElementById('confirmDeleteCategory');
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
//   new LabTestCategoryManager();
// });
