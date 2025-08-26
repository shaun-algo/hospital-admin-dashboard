class BillingManager {
  constructor() {
    this.baseApiUrl = 'http://localhost/hospital_billing2/api/transactions/billing.php';
    this.admissionApiUrl = 'http://localhost/hospital_billing2/api/transactions/admission.php';
    this.billingCategoryApiUrl = 'http://localhost/hospital_billing2/api/billing_category.php';
    this.admissions = [];
    this.billingCategories = [];
    this.billings = [];
    this.selectedAdmissionId = null;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.setupEventListeners = this.setupEventListeners.bind(this);
    this.loadAdmissions = this.loadAdmissions.bind(this);
    this.loadBillingCategories = this.loadBillingCategories.bind(this);
    this.loadBillings = this.loadBillings.bind(this);
    this.loadBillingSummary = this.loadBillingSummary.bind(this);
    this.renderBillingsTable = this.renderBillingsTable.bind(this);
    this.renderBillingSummary = this.renderBillingSummary.bind(this);
    this.openModal = this.openModal.bind(this);
    this.saveBilling = this.saveBilling.bind(this);
    this.deleteBilling = this.deleteBilling.bind(this);
    this.updateTotalAmount = this.updateTotalAmount.bind(this);
    this.formatCurrency = this.formatCurrency.bind(this);
    
    this.init();
  }

  init() {
    this.loadAdmissions();
    this.loadBillingCategories();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Admission selection change
    document.getElementById('admissionSelect').addEventListener('change', (e) => {
      this.selectedAdmissionId = e.target.value;
      if (this.selectedAdmissionId) {
        this.loadBillings();
        this.loadBillingSummary();
        this.displayPatientInfo();
      } else {
        this.billings = [];
        this.renderBillingsTable();
        this.renderBillingSummary([]);
        document.getElementById('patientInfo').innerHTML = '';
      }
    });

    // Add billing button
    document.getElementById('addBillingBtn').addEventListener('click', () => {
      if (!this.selectedAdmissionId) {
        alert('Please select an admission first');
        return;
      }
      this.openModal('add');
    });

    // Save billing button
    document.getElementById('saveBillingBtn').addEventListener('click', this.saveBilling);

    // Confirm delete button
    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
      const billingId = document.getElementById('deleteItemId').value;
      if (billingId) {
        this.deleteBilling(billingId);
      }
    });

    // Calculate total amount when quantity or unit price changes
    document.getElementById('quantity').addEventListener('input', this.updateTotalAmount);
    document.getElementById('unitPrice').addEventListener('input', this.updateTotalAmount);

    // Table actions (edit/delete)
    document.getElementById('billingTableBody').addEventListener('click', (e) => {
      const target = e.target.closest('button');
      if (!target) return;

      const action = target.getAttribute('data-action');
      const id = target.getAttribute('data-id');

      if (!action || !id) return;

      if (action === 'edit') {
        this.openModal('edit', id);
      } else if (action === 'delete') {
        document.getElementById('deleteItemId').value = id;
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        deleteModal.show();
      }
    });
  }

  async loadAdmissions() {
    try {
      const res = await axios.get(this.admissionApiUrl, {
        params: { operation: 'getAllAdmissions' }
      });
      
      if (res.data.error) throw new Error(res.data.error);
      
      this.admissions = Array.isArray(res.data) ? res.data : [];
      const selectEl = document.getElementById('admissionSelect');
      
      if (this.admissions.length === 0) {
        selectEl.innerHTML = '<option value="">No admissions found</option>';
        return;
      }
      
      selectEl.innerHTML = '<option value="">-- Select Admission --</option>' + 
        this.admissions.map(a => `
          <option value="${a.admissionid}">
            #${a.admissionid} - ${a.patient_name} (${new Date(a.admission_date).toLocaleDateString()})
          </option>
        `).join('');
    } catch (err) {
      console.error('Error loading admissions:', err);
      alert('Failed to load admissions. Please try again.');
    }
  }

  async loadBillingCategories() {
    try {
      const res = await axios.get(this.billingCategoryApiUrl, {
        params: { operation: 'getAllBillingCategories' }
      });
      
      if (res.data.error) throw new Error(res.data.error);
      
      this.billingCategories = Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error('Error loading billing categories:', err);
      alert('Failed to load billing categories. Please try again.');
    }
  }

  async loadBillings() {
    if (!this.selectedAdmissionId) return;
    
    try {
      const res = await axios.get(this.baseApiUrl, {
        params: { 
          operation: 'getAllBillings',
          admissionid: this.selectedAdmissionId 
        }
      });
      
      if (res.data.error) throw new Error(res.data.error);
      
      this.billings = Array.isArray(res.data) ? res.data : [];
      this.renderBillingsTable();
    } catch (err) {
      console.error('Error loading billings:', err);
      alert('Failed to load billing records. Please try again.');
      this.billings = [];
      this.renderBillingsTable();
    }
  }

  async loadBillingSummary() {
    if (!this.selectedAdmissionId) return;
    
    try {
      // Get billing summary by category
      const summaryRes = await axios.get(this.baseApiUrl, {
        params: { 
          operation: 'getBillingsByCategory',
          admissionid: this.selectedAdmissionId 
        }
      });
      
      if (summaryRes.data.error) throw new Error(summaryRes.data.error);
      
      const summaryData = summaryRes.data.data || [];
      this.renderBillingSummary(summaryData);
      
      // Get total billing amount
      const totalRes = await axios.get(this.baseApiUrl, {
        params: { 
          operation: 'getTotalBilling',
          admissionid: this.selectedAdmissionId 
        }
      });
      
      if (totalRes.data.error) throw new Error(totalRes.data.error);
      
      const totalAmount = totalRes.data.total_amount || 0;
      document.getElementById('grandTotal').textContent = `Total: ₱${this.formatCurrency(totalAmount)}`;
    } catch (err) {
      console.error('Error loading billing summary:', err);
      this.renderBillingSummary([]);
      document.getElementById('grandTotal').textContent = 'Total: ₱0.00';
    }
  }

  renderBillingsTable() {
    const tbody = document.getElementById('billingTableBody');
    if (!tbody) return;

    if (!this.billings.length) {
      tbody.innerHTML = `
        <tr><td colspan="8" class="text-center text-muted py-3">No billing records found.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.billings.map(b => `
      <tr>
        <td>${b.billingid}</td>
        <td>${b.category_name}</td>
        <td>${b.description || '-'}</td>
        <td>${b.quantity}</td>
        <td class="text-end">₱${this.formatCurrency(b.unit_price)}</td>
        <td class="text-end">₱${this.formatCurrency(b.total_amount)}</td>
        <td>${new Date(b.billing_date).toLocaleDateString()}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1" data-id="${b.billingid}" data-action="edit" title="Edit Billing">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" data-id="${b.billingid}" data-action="delete" title="Delete Billing">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>`).join('');
  }

  renderBillingSummary(summaryData) {
    const tbody = document.getElementById('billingSummaryTableBody');
    if (!tbody) return;

    if (!summaryData || !summaryData.length) {
      tbody.innerHTML = `
        <tr><td colspan="2" class="text-center text-muted py-3">No billing data available.</td></tr>`;
      return;
    }

    tbody.innerHTML = summaryData.map(item => `
      <tr>
        <td>${item.category_name}</td>
        <td class="text-end">₱${this.formatCurrency(item.total_amount)}</td>
      </tr>`).join('');
  }

  displayPatientInfo() {
    if (!this.selectedAdmissionId) {
      document.getElementById('patientInfo').innerHTML = '';
      return;
    }
    
    const admission = this.admissions.find(a => a.admissionid == this.selectedAdmissionId);
    if (!admission) return;
    
    document.getElementById('patientInfo').innerHTML = `
      <strong>Patient:</strong> ${admission.patient_name}<br>
      <strong>Admission Date:</strong> ${new Date(admission.admission_date).toLocaleDateString()}<br>
      <strong>Status:</strong> <span class="badge ${admission.status === 'Active' ? 'bg-success' : 'bg-secondary'}">${admission.status}</span>
    `;
  }

  openModal(mode, billingId = null) {
    const modalTitle = document.getElementById('billingModalLabel');
    const billingForm = document.getElementById('billingForm');
    const billingIdInput = document.getElementById('billingId');
    const modalAdmissionIdInput = document.getElementById('modalAdmissionId');
    const categorySelect = document.getElementById('billingCategory');
    const descriptionInput = document.getElementById('description');
    const quantityInput = document.getElementById('quantity');
    const unitPriceInput = document.getElementById('unitPrice');
    const totalAmountInput = document.getElementById('totalAmount');
    const saveBtn = document.getElementById('saveBillingBtn');
    
    // Reset form
    billingForm.reset();
    billingForm.classList.remove('was-validated');
    
    // Set admission ID
    modalAdmissionIdInput.value = this.selectedAdmissionId;
    
    // Populate billing categories
    categorySelect.innerHTML = '<option value="">-- Select Category --</option>' + 
      this.billingCategories.map(c => `
        <option value="${c.billing_categoryid}">${c.name}</option>
      `).join('');
    
    if (mode === 'edit' && billingId) {
      // Edit mode
      modalTitle.textContent = 'Edit Billing';
      saveBtn.textContent = 'Update';
      billingIdInput.value = billingId;
      
      // Find the billing record
      const billing = this.billings.find(b => b.billingid == billingId);
      if (billing) {
        categorySelect.value = billing.billing_categoryid;
        descriptionInput.value = billing.description || '';
        quantityInput.value = billing.quantity;
        unitPriceInput.value = billing.unit_price;
        this.updateTotalAmount();
      }
    } else {
      // Add mode
      modalTitle.textContent = 'Add Billing';
      saveBtn.textContent = 'Save';
      billingIdInput.value = '';
      quantityInput.value = 1;
      unitPriceInput.value = '';
      totalAmountInput.value = '';
    }
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('billingModal'));
    modal.show();
  }

  updateTotalAmount() {
    const quantity = parseFloat(document.getElementById('quantity').value) || 0;
    const unitPrice = parseFloat(document.getElementById('unitPrice').value) || 0;
    const totalAmount = quantity * unitPrice;
    document.getElementById('totalAmount').value = this.formatCurrency(totalAmount);
  }

  async saveBilling() {
    const form = document.getElementById('billingForm');
    form.classList.add('was-validated');
    
    if (!form.checkValidity()) {
      return;
    }
    
    const billingId = document.getElementById('billingId').value;
    const admissionId = document.getElementById('modalAdmissionId').value;
    const categoryId = document.getElementById('billingCategory').value;
    const description = document.getElementById('description').value;
    const quantity = document.getElementById('quantity').value;
    const unitPrice = document.getElementById('unitPrice').value;
    
    const payload = {
      billingid: billingId || undefined,
      admissionid: admissionId,
      billing_categoryid: categoryId,
      description: description,
      quantity: quantity,
      unit_price: unitPrice
    };
    
    const saveBtn = document.getElementById('saveBillingBtn');
    const originalText = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
    
    try {
      const operation = billingId ? 'updateBilling' : 'insertBilling';
      const res = await axios.post(this.baseApiUrl, {
        operation: operation,
        json: payload
      });
      
      if (res.data.error) throw new Error(res.data.error);
      
      // Close modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('billingModal'));
      modal.hide();
      
      // Reload data
      await this.loadBillings();
      await this.loadBillingSummary();
      
      // Show success message
      alert(billingId ? 'Billing updated successfully!' : 'Billing added successfully!');
    } catch (err) {
      console.error('Error saving billing:', err);
      alert(`Failed to save billing: ${err.message}`);
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = originalText;
    }
  }

  async deleteBilling(billingId) {
    try {
      const res = await axios.post(this.baseApiUrl, {
        operation: 'deleteBilling',
        billingid: billingId
      });
      
      if (res.data.error) throw new Error(res.data.error);
      
      // Close modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
      modal.hide();
      
      // Reload data
      await this.loadBillings();
      await this.loadBillingSummary();
      
      // Show success message
      alert('Billing deleted successfully!');
    } catch (err) {
      console.error('Error deleting billing:', err);
      alert(`Failed to delete billing: ${err.message}`);
    }
  }

  formatCurrency(value) {
    return parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

// Initialize the billing manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BillingManager();
});