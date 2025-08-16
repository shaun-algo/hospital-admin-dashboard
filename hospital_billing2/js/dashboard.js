// Dashboard Navigation and Module Loader
const modules = {
  doctors: {
    name: 'Doctors',
    icon: 'bi-person-badge',
    html: 'pages/masterfiles/doctors.html',
    js: 'js/masterfiles/doctors.js',
    hasCRUD: true
  },
  lab_test_category: {
    name: 'Lab Test Category',
    icon: 'bi-diagram-3',
    html: 'pages/masterfiles/lab_test_category.html',
    js: 'js/masterfiles/lab_test_category.js',
    hasCRUD: true
  },
  lab_test: {
    name: 'Lab Test',
    icon: 'bi-flask',
    html: 'pages/masterfiles/lab_test.html',
    js: 'js/masterfiles/lab_test.js',
    hasCRUD: true
  },
  medicine: {
    name: 'Medicine',
    icon: 'bi-capsule',
    html: 'pages/masterfiles/medicine.html',
    hasCRUD: false
  },
  membership_provider: {
    name: 'Membership Provider',
    icon: 'bi-people',
    html: 'pages/masterfiles/membership_provider.html',
    hasCRUD: false
  },
  membership_coverage: {
    name: 'Membership Coverage',
    icon: 'bi-shield-check',
    html: 'pages/masterfiles/membership_coverage.html',
    hasCRUD: false
  },
  patient: {
    name: 'Patient',
    icon: 'bi-person',
    html: 'pages/masterfiles/patient.html',
    hasCRUD: false
  },
  role: {
    name: 'Role',
    icon: 'bi-person-lines-fill',
    html: 'pages/masterfiles/role.html',
    hasCRUD: false
  },
  room_category: {
    name: 'Room Category',
    icon: 'bi-door-open',
    html: 'pages/masterfiles/room_category.html',
    hasCRUD: false
  },
  room: {
    name: 'Room',
    icon: 'bi-house-door',
    html: 'pages/masterfiles/room.html',
    hasCRUD: false
  },
  user: {
    name: 'User',
    icon: 'bi-person-circle',
    html: 'pages/masterfiles/user.html',
    hasCRUD: false
  },
};

// Sidebar navigation (all nav-link[data-module])
const sidebarLinks = document.querySelectorAll('.sidebar .nav-link[data-module]');
sidebarLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    // Remove active from all
    sidebarLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');

    // On mobile, close dropdown after click
    const collapse = document.getElementById('masterfilesMenu');
    if (collapse && window.innerWidth < 992) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse);
      bsCollapse.hide();
    }

    const moduleKey = this.getAttribute('data-module');
    loadModule(moduleKey);
  });
});

// Masterfiles chevron rotation
const masterfilesToggle = document.getElementById('masterfilesToggle');
const masterfilesMenu = document.getElementById('masterfilesMenu');
const masterfilesChevron = document.getElementById('masterfilesChevron');
if (masterfilesToggle && masterfilesMenu && masterfilesChevron) {
  masterfilesMenu.addEventListener('show.bs.collapse', () => {
    masterfilesChevron.style.transform = 'rotate(180deg)';
  });
  masterfilesMenu.addEventListener('hide.bs.collapse', () => {
    masterfilesChevron.style.transform = '';
  });
}

// Settings link
const settingsLink = document.getElementById('sidebarSettings');
if (settingsLink) {
  settingsLink.addEventListener('click', function(e) {
    e.preventDefault();
    showSettingsModal();
  });
}

function showSettingsModal() {
  // Remove any existing modals
  document.querySelectorAll('.modal').forEach(m => m.remove());

  const modalHtml = `
    <div class="modal fade" id="settingsModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><i class="bi bi-gear me-2"></i>Settings</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">Settings and profile features coming soon.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const modal = new bootstrap.Modal(document.getElementById('settingsModal'));
  modal.show();
}

// Module loader: loads HTML and initializes JS if needed
function loadModule(moduleKey) {
  const module = modules[moduleKey];
  if (!module) {
    console.error('Module not found:', moduleKey);
    return;
  }

  console.log(`Loading module: ${module.name}, HTML path: ${module.html}`);

  // Show loading indicator
  document.getElementById('mainContent').innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">Loading ${module.name}...</p>
    </div>`;

  // Fetch the HTML for the selected module
  fetch(module.html)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      // Inject the HTML into the main content area
      document.getElementById('mainContent').innerHTML = html;

      // If the module has CRUD functionality, load its JavaScript
      if (module.hasCRUD && module.js) {
        console.log(`Loading JS for ${module.name}: ${module.js}`);

        // Remove any existing script with the same src
        const existingScript = document.querySelector(`script[src="${module.js}"]`);
        if (existingScript) {
          existingScript.remove();
        }

        // Create and append the script
        const script = document.createElement('script');
        script.src = module.js;
        script.onload = () => {
          console.log(`JS loaded successfully for ${module.name}`);
          // Initialize the module after a longer delay to ensure DOM is ready
          setTimeout(() => {
            initializeModule(moduleKey);
          }, 300);
        };
        script.onerror = (error) => {
          console.error(`Failed to load JS for ${module.name}:`, error);
        };
        document.body.appendChild(script);
      }
    })
    .catch(error => {
      console.error('Error loading module:', error);
      document.getElementById('mainContent').innerHTML = `
        <div class="alert alert-danger m-4">
          <h4 class="alert-heading">Error Loading Module</h4>
          <p>Failed to load <strong>${module.name}</strong> module.</p>
          <hr>
          <p class="mb-0">Error: ${error.message}</p>
          <p class="mb-0">Please check the file path: <code>${module.html}</code></p>
        </div>`;
    });
}

// Initialize module after JavaScript is loaded
function initializeModule(moduleKey) {
  console.log(`Initializing module: ${moduleKey}`);

  // Wait longer to ensure everything is loaded and DOM is ready
  setTimeout(() => {
    switch(moduleKey) {
      case 'doctors':
        if (typeof DoctorsManager !== 'undefined') {
          console.log('DoctorsManager class found, creating instance');
          const doctorsInstance = new DoctorsManager();
          console.log('Doctors module instance created:', doctorsInstance);

          // Test if the add button exists and has event listener
          setTimeout(() => {
            const addBtn = document.getElementById('addDoctorBtn');
            console.log('Add button after initialization:', addBtn);
            if (addBtn) {
              console.log('Add button onclick:', addBtn.onclick);
            }
          }, 500);

        } else {
          console.error('DoctorsManager class not found');
        }
        break;

      case 'lab_test_category':
        if (typeof LabTestCategoryManager !== 'undefined') {
          console.log('LabTestCategoryManager class found, creating instance');
          const categoryInstance = new LabTestCategoryManager();
          console.log('Lab Test Category module instance created:', categoryInstance);
        } else {
          console.error('LabTestCategoryManager class not found');
        }
        break;

      case 'lab_test':
        if (typeof LabTestManager !== 'undefined') {
          console.log('LabTestManager class found, creating instance');
          const testInstance = new LabTestManager();
          console.log('Lab Test module instance created:', testInstance);
        } else {
          console.error('LabTestManager class not found');
        }
        break;

      default:
        console.log(`Module ${moduleKey} does not require initialization`);
    }
  }, 500);
}

// Load default module on page load
window.addEventListener('DOMContentLoaded', () => {
  console.log('Dashboard initialized, loading default module: Doctors');
  loadModule('doctors');
});
