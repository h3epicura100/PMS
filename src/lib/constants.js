// ============================================
// EVENT MANAGEMENT SYSTEM — CONSTANTS
// ============================================

// --- STATUS ENUMS ---
export const STATUS = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  DELAYED: 'Delayed',
};

export const EVENT_STATUS = {
  PLANNED: 'Planned',
  ONGOING: 'Ongoing',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

// --- FUNCTION TYPES ---
export const FUNCTION_TYPES = [
  'Wedding',
  'Birthday',
  'Corporate',
  'Anniversary',
  'Engagement',
  'Reception',
  'Social Gathering',
  'Festival',
  'Other',
];

// --- MENU TYPES ---
export const MENU_TYPES = ['Veg', 'Non-Veg', 'Custom'];

// --- VENDOR CATEGORIES ---
export const VENDOR_CATEGORIES = [
  'Decor',
  'Catering',
  'Equipment',
  'Staff',
  'Transport',
  'Photography',
  'Entertainment',
  'Other',
];

// --- INVENTORY CATEGORIES ---
export const INVENTORY_CATEGORIES = [
  'Kitchen Equipment',
  'Decor Items',
  'Crockery',
  'Linen',
  'Furniture',
  'Electronics',
  'Consumables',
  'Other',
];

// --- PHASES ---
export const PHASES = {
  PRE_EVENT: 'Pre-Event Planning',
  KITCHEN_DISPATCH: 'Kitchen & Dispatch',
  EXECUTION: 'On-Ground Execution',
};

// --- PRE-EVENT TASK TEMPLATES ---
// daysBeforeEvent: negative = days before event
export const PRE_EVENT_TASKS = [
  { id: 'PRE-01', name: 'Order Date Block', owner: 'Anyone', daysBeforeEvent: 0, phase: PHASES.PRE_EVENT },
  { id: 'PRE-02', name: 'Menu Finalization', owner: 'PC / WhatsApp', daysBeforeEvent: -2, phase: PHASES.PRE_EVENT },
  { id: 'PRE-03', name: 'Vendor Finalization', owner: 'Naresh / Sonia', daysBeforeEvent: -2, phase: PHASES.PRE_EVENT },
  { id: 'PRE-04', name: 'Send Menu to Executive Chef', owner: 'Management', daysBeforeEvent: -2, phase: PHASES.PRE_EVENT },
  { id: 'PRE-05', name: 'Chef Coordination', owner: 'Shashi', daysBeforeEvent: -1, phase: PHASES.PRE_EVENT },
  { id: 'PRE-06', name: 'Tagging + Uniform Check', owner: 'Chef + Mgmt', daysBeforeEvent: -1, phase: PHASES.PRE_EVENT },
  { id: 'PRE-07', name: 'Outsource Vendor Update', owner: 'Naresh', daysBeforeEvent: -1, phase: PHASES.PRE_EVENT },
  { id: 'PRE-08', name: 'Store List Ready', owner: 'Store Incharge', daysBeforeEvent: -1, phase: PHASES.PRE_EVENT },
  { id: 'PRE-09', name: 'Grocery List Ready', owner: 'Grocery Incharge', daysBeforeEvent: -1, phase: PHASES.PRE_EVENT },
  { id: 'PRE-10', name: 'Decor List Ready', owner: 'Naresh', daysBeforeEvent: -1, phase: PHASES.PRE_EVENT },
  { id: 'PRE-11', name: 'Final Vendor Arrangement', owner: 'Management', daysBeforeEvent: -1, phase: PHASES.PRE_EVENT },
];

// --- KITCHEN & DISPATCH TASK TEMPLATES ---
export const KITCHEN_TASKS = [
  { id: 'KIT-01', name: 'TOS (Task Order Start)', owner: 'Chef', plannedTime: '09:00', phase: PHASES.KITCHEN_DISPATCH },
  { id: 'KIT-02', name: 'OS Status Check', owner: 'Chef', plannedTime: '09:30', phase: PHASES.KITCHEN_DISPATCH },
  { id: 'KIT-03', name: 'Kitchen Start', owner: 'Head Chef', plannedTime: '09:00', phase: PHASES.KITCHEN_DISPATCH },
  { id: 'KIT-04', name: 'Tagging', owner: 'Kitchen Staff', plannedTime: '12:00', phase: PHASES.KITCHEN_DISPATCH },
  { id: 'KIT-05', name: 'Loading', owner: 'Kitchen Staff', plannedTime: '14:00', phase: PHASES.KITCHEN_DISPATCH },
  { id: 'KIT-06', name: 'Kitchen Close', owner: 'Head Chef', plannedTime: '14:30', phase: PHASES.KITCHEN_DISPATCH },
  { id: 'KIT-07', name: 'Dispatch', owner: 'Dispatch Team', plannedTime: '15:00', phase: PHASES.KITCHEN_DISPATCH },
];

// --- 15-STEP EXECUTION TASK TEMPLATES ---
export const EXECUTION_TASKS = [
  { step: 1,  id: 'EXE-01', name: 'Decor Team Arrival',        owner: 'Decor Vendor',     support: 'Unloading Team',  plannedTime: '15:00', dependsOn: null },
  { step: 2,  id: 'EXE-02', name: 'Material Unloading',         owner: 'Suman',            support: 'Helpers',         plannedTime: '15:00', dependsOn: 'EXE-01' },
  { step: 3,  id: 'EXE-03', name: 'Decor Setup Start',          owner: 'Aashu',            support: 'Decor Team',      plannedTime: '15:00', dependsOn: 'EXE-02' },
  { step: 4,  id: 'EXE-04', name: 'Counter Setup',              owner: 'Setup Team',       support: 'Decor Team',      plannedTime: '15:00', dependsOn: 'EXE-02' },
  { step: 5,  id: 'EXE-05', name: 'Kitchen Arrival',            owner: 'Chef',             support: 'Kitchen Staff',   plannedTime: '15:00', dependsOn: null },
  { step: 6,  id: 'EXE-06', name: 'Grocery Arrangement',        owner: 'Grocery Incharge', support: 'Helpers',         plannedTime: '15:00', dependsOn: 'EXE-05' },
  { step: 7,  id: 'EXE-07', name: 'Equipment & Station Setup',  owner: 'Kitchen Team',     support: '',                plannedTime: '15:00', dependsOn: 'EXE-05' },
  { step: 8,  id: 'EXE-08', name: 'Section-wise Food Arrangement', owner: 'Chefs',         support: '',                plannedTime: '15:00', dependsOn: 'EXE-05' },
  { step: 9,  id: 'EXE-09', name: 'Uniform Distribution',       owner: 'Shashi',           support: '',                plannedTime: '15:00', dependsOn: null },
  { step: 10, id: 'EXE-10', name: 'Service Team Briefing',      owner: 'Captain / Manager', support: '',               plannedTime: '15:00', dependsOn: null },
  { step: 11, id: 'EXE-11', name: 'Food Trial Check',           owner: 'Head Chef',        support: '',                plannedTime: '15:00', dependsOn: 'EXE-08' },
  { step: 12, id: 'EXE-12', name: 'Food Balancing',             owner: 'Chef',             support: '',                plannedTime: '15:00', dependsOn: 'EXE-11' },
  { step: 13, id: 'EXE-13', name: 'Live Counter Setup',         owner: 'Live Chef',        support: '',                plannedTime: '15:00', dependsOn: null },
  { step: 14, id: 'EXE-14', name: 'Food Service Start',         owner: 'Service Team',     support: '',                plannedTime: '15:00', dependsOn: 'EXE-11' },
  { step: 15, id: 'EXE-15', name: 'Event Monitoring',           owner: 'Shashi / Manager', support: '',                plannedTime: '15:00', dependsOn: null },
];

// --- SIDEBAR NAVIGATION ---
export const NAV_ITEMS = [
  { path: '/',                label: 'Dashboard',       icon: 'dashboard', permission: 'dashboard' },
  { path: '/bookings',        label: 'Bookings',        icon: 'booking',   permission: 'bookings' },
  { 
    path: '/menu-finalize',   
    label: 'Menu Finalize',   
    icon: 'menu',
    permission: 'menu-finalize',
    mapping: { planned: 8, actual: 9, status: 11, file: 12 }
  },
  { 
    path: '/vendor-finalize', 
    label: 'Vendor Finalize', 
    icon: 'vendor',
    permission: 'vendor-finalize',
    mapping: { planned: 13, actual: 14, status: 16, file: 17 }
  },
  { 
    path: '/inform-chef',     
    label: 'Inform to Chef',  
    icon: 'chef',
    permission: 'inform-chef',
    mapping: { planned: 18, actual: 19, status: 21, file: null }
  },
  { 
    path: '/tag-prints',      
    label: 'Tag Prints',      
    icon: 'tag',
    permission: 'tag-prints',
    mapping: { planned: 22, actual: 23, status: 25, file: null }
  },
  { 
    path: '/outsource-vendor', 
    label: 'Outsource Vendor', 
    icon: 'vendor_update',
    permission: 'outsource-vendor',
    mapping: { planned: 26, actual: 27, status: 29, file: null }
  },
  { 
    path: '/material-arrangement', 
    label: 'Material Arrangement', 
    icon: 'material',
    permission: 'material-arrangement',
    mapping: { planned: 30, actual: 31, status: 33, file: null }
  },
  { 
    path: '/crockery-list', 
    label: 'Crockery List', 
    icon: 'crockery',
    permission: 'crockery-list',
    mapping: { planned: 34, actual: 35, status: 37, file: null }
  },
  { 
    path: '/decor-list', 
    label: 'Decor List', 
    icon: 'decor',
    permission: 'decor-list',
    mapping: { planned: 38, actual: 39, status: 41, file: null }
  },
  { 
    path: '/final-outsource', 
    label: 'Final Outsource', 
    icon: 'truck',
    permission: 'final-outsource',
    mapping: { planned: 42, actual: 43, status: 45, file: null }
  },
];

// --- ORDER ID GENERATION ---
export const generateOrderId = (counter) => {
  return `EVT-${String(counter).padStart(3, '0')}`;
};

// --- DATE HELPERS ---
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};


export const formatTime = (timeStr) => {
  if (!timeStr) return '—';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

export const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

export const getToday = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

// --- DELAY CALCULATION ---
export const calculateDelay = (plannedTime, actualTime) => {
  if (!plannedTime || !actualTime) return 0;
  const [ph, pm] = plannedTime.split(':').map(Number);
  const [ah, am] = actualTime.split(':').map(Number);
  return (ah * 60 + am) - (ph * 60 + pm);
};
