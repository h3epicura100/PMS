import {
  STATUS,
  EVENT_STATUS,
  PRE_EVENT_TASKS,
  KITCHEN_TASKS,
  EXECUTION_TASKS,
  PHASES,
  generateOrderId,
  getToday,
  getCurrentTime,
} from './constants';

const KEYS = {
  EVENTS: 'ems_events',
  TASKS: 'ems_tasks',
  VENDORS: 'ems_vendors',
  INVENTORY: 'ems_inventory',
  COUNTER: 'ems_counter',
};

const SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

// --- HELPERS ---
const read = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const write = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const readCounter = () => parseInt(localStorage.getItem(KEYS.COUNTER) || '0');
const writeCounter = (val) => localStorage.setItem(KEYS.COUNTER, String(val));

// --- GAS SUBMISSION ---
export const submitToSheet = async (sheetName, rowData) => {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: new URLSearchParams({
        action: 'insert',
        sheetName: sheetName,
        rowData: JSON.stringify(rowData),
      }),
    });
    return true; 
  } catch (error) {
    console.error('Sheet submission failed:', error);
    return false;
  }
};

/**
 * Uploads a file to Google Drive via GAS uploadFile action
 */
export const uploadFileToDrive = async (file) => {
  try {
    const reader = new FileReader();
    const base64Promise = new Promise((resolve) => {
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    
    const base64 = await base64Promise;
    const folderId = import.meta.env.VITE_FOLDER_ID;

    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: new URLSearchParams({
        action: 'uploadFile',
        fileName: file.name,
        mimeType: file.type,
        base64Data: base64,
        folderId: folderId,
      }),
    });

    const text = await response.text(); 
    const result = JSON.parse(text);

    if (!result.success) {
      console.error('GAS Upload Error:', result.error);
    }
    return result.success ? result.fileUrl : null;
  } catch (error) {
    console.error('File upload network/parsing error:', error);
    return null;
  }
};


/**
 * Converts ISO date strings (returned by GAS getValues) back to Google Sheets
 * date serial numbers so setValues() stores them as date cells, not text.
 * GAS/Sheets epoch is Dec 30 1899; JS epoch is Jan 1 1970 (diff = 25569 days).
 */
const toSheetsSerial = (value) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return Math.round(d.getTime() / 86400000 + 25569);
  }
  return value;
};

/**
 * Updates a specific row in the sheet.
 * rowData can be an Array (full row) or an Object (targeted columns, e.g. {10: "val"})
 * orderNo is REQUIRED so the backend can find which row to update.
 */
export const updateSheetRow = async (sheetName, rowData, orderNo) => {
  try {
    let sanitized;
    if (Array.isArray(rowData)) {
      sanitized = rowData.map(cell => toSheetsSerial(cell));
    } else {
      sanitized = {};
      for (const col in rowData) {
        sanitized[col] = toSheetsSerial(rowData[col]);
      }
    }

    // mode: 'no-cors' is mandatory for GAS POST requests from localhost
    // Note: We cannot read the response body in no-cors mode, so we return true
    // if the fetch call itself didn't throw a network error.
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: new URLSearchParams({
        action: 'update',
        sheetName: sheetName,
        orderNo: orderNo,
        rowData: JSON.stringify(sanitized),
      }),
    });
    const text = await response.text();
    const result = JSON.parse(text);
    return result.success;
  } catch (error) {
    console.error('Sheet update failed:', error);
    return false;
  }
};



/**
 * Fetches raw data rows from the sheet (including metadata/headers if slice not handled)
 * Uses fetchPaginated to get deep column access
 */
export const getRawSheetData = async (sheetName) => {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=fetchPaginated&sheet=${sheetName}&page=0&pageSize=1000`);
    const text = await response.text(); // Backend returns MimeType.TEXT
    const data = JSON.parse(text);
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Failed to fetch raw sheet data:', error);
    return [];
  }
};


export const getEventsFromSheet = async () => {
  try {
    // Use 'sheet' param (not 'sheetName') to match the new GAS backend doGet logic
    const response = await fetch(`${SCRIPT_URL}?action=fetch&sheet=ORDER`);
    
    // Backend now returns MimeType.TEXT, so parse as text first
    const text = await response.text();
    const data = JSON.parse(text);
    
    if (data.success && Array.isArray(data.data)) {
      // data.data is a raw 2D array from the sheet (all rows including headers)
      // Row 0 is the header row, rows 1-5 are metadata, data starts from Row 6 (index 6)
      const rows = data.data.slice(6); // Skip header + 5 metadata rows
      
      return rows
        .filter(row => row[1] || row[2]) // Only rows with Order No or Customer Name
        .map(row => ({
          timestamp:    row[0],
          orderNo:      row[1],
          customerName: row[2],
          phone:        row[3],
          functionType: row[4],
          eventDate:    row[5] instanceof Date
            ? row[5].toISOString().split('T')[0]
            : row[5],
          venue:        row[6],
          guests:       row[7],
        }));
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch events from sheet:', error);
    return [];
  }
};



// ==========================================
// EVENTS
// ==========================================
export const getEvents = () => read(KEYS.EVENTS);

export const getEvent = (orderId) => {
  return getEvents().find((e) => e.orderId === orderId) || null;
};

export const createEvent = async (formData) => {
  const counter = readCounter() + 1;
  writeCounter(counter);

  const orderId = generateOrderId(counter);
  // Build clean local timestamp: DD/MM/YYYY HH:MM:SS (no timezone, no AM/PM)
  const _now = new Date();
  const _pad = n => String(n).padStart(2, '0');
  const timestamp = `${_pad(_now.getDate())}/${_pad(_now.getMonth() + 1)}/${_now.getFullYear()} ${_pad(_now.getHours())}:${_pad(_now.getMinutes())}:${_pad(_now.getSeconds())}`;


  const event = {
    orderId,
    orderDate: getToday(),
    customerName: formData.customerName,
    phone: formData.phone,
    functionType: formData.functionType,
    eventDate: formData.eventDate,
    venue: formData.venue,
    guests: parseInt(formData.guests) || 0,
    status: EVENT_STATUS.PLANNED,
    createdAt: new Date().toISOString(),
  };

  // 1. Submit to Google Sheets (Async)
  // New Mapping: A:TS, B:OrderNo, C:Name, D:Phone, E:Type, F:Date, G:Venue, H:People
  const rowData = [
    timestamp,           // Col A: Timestamp
    "",                  // Col B: Order No (Generated by GAS)
    event.customerName,  // Col C
    event.phone,         // Col D
    event.functionType,  // Col E
    event.eventDate,     // Col F
    event.venue,         // Col G
    event.guests         // Col H
  ];


  // We await this to ensure it goes through before completing
  await submitToSheet('ORDER', rowData);

  const events = getEvents();
  events.push(event);
  write(KEYS.EVENTS, events);

  // Auto-generate tasks
  generateTasksForEvent(event);

  return event;
};


export const updateEvent = (orderId, updates) => {
  const events = getEvents();
  const idx = events.findIndex((e) => e.orderId === orderId);
  if (idx === -1) return null;
  events[idx] = { ...events[idx], ...updates };
  write(KEYS.EVENTS, events);
  return events[idx];
};

export const deleteEvent = (orderId) => {
  const events = getEvents().filter((e) => e.orderId !== orderId);
  write(KEYS.EVENTS, events);
  // Also delete tasks
  const tasks = getAllTasks().filter((t) => t.eventId !== orderId);
  write(KEYS.TASKS, tasks);
};

// ==========================================
// TASKS
// ==========================================
export const getAllTasks = () => read(KEYS.TASKS);

export const getTasksForEvent = (orderId) => {
  return getAllTasks().filter((t) => t.eventId === orderId);
};

export const getTasksByPhase = (orderId, phase) => {
  return getTasksForEvent(orderId).filter((t) => t.phase === phase);
};

export const getExecutionTasks = (orderId) => {
  return getTasksByPhase(orderId, PHASES.EXECUTION).sort((a, b) => a.step - b.step);
};

export const getPreEventTasks = (orderId) => {
  return getTasksByPhase(orderId, PHASES.PRE_EVENT);
};

export const getKitchenTasks = (orderId) => {
  return getTasksByPhase(orderId, PHASES.KITCHEN_DISPATCH);
};

export const updateTask = (eventId, taskId, updates) => {
  const tasks = getAllTasks();
  const idx = tasks.findIndex((t) => t.eventId === eventId && t.taskId === taskId);
  if (idx === -1) return null;

  // If marking as completed or in-progress, record actual time
  if (updates.status === STATUS.COMPLETED || updates.status === STATUS.IN_PROGRESS) {
    if (!tasks[idx].actualTime) {
      updates.actualTime = getCurrentTime();
    }
  }

  // Calculate delay
  if (updates.actualTime && tasks[idx].plannedTime) {
    const [ph, pm] = tasks[idx].plannedTime.split(':').map(Number);
    const [ah, am] = updates.actualTime.split(':').map(Number);
    const delayMins = (ah * 60 + am) - (ph * 60 + pm);
    updates.delay = delayMins > 0 ? delayMins : 0;
  }

  tasks[idx] = { ...tasks[idx], ...updates };
  write(KEYS.TASKS, tasks);
  return tasks[idx];
};

export const getTodaysTasks = () => {
  const today = getToday();
  const events = getEvents().filter((e) => e.eventDate === today);
  const eventIds = events.map((e) => e.orderId);
  return getAllTasks().filter((t) => eventIds.includes(t.eventId));
};

export const getDelayedTasks = () => {
  return getAllTasks().filter((t) => t.status === STATUS.DELAYED);
};

// --- AUTO GENERATE TASKS ---
const generateTasksForEvent = (event) => {
  const tasks = getAllTasks();
  const eventDate = new Date(event.eventDate);

  // Pre-Event Tasks
  PRE_EVENT_TASKS.forEach((template) => {
    const deadline = new Date(eventDate);
    deadline.setDate(deadline.getDate() + template.daysBeforeEvent);

    tasks.push({
      eventId: event.orderId,
      taskId: template.id,
      name: template.name,
      owner: template.owner,
      support: '',
      phase: template.phase,
      plannedDate: deadline.toISOString().split('T')[0],
      plannedTime: '18:00',
      actualTime: '',
      delay: 0,
      status: STATUS.NOT_STARTED,
      remarks: '',
      step: 0,
    });
  });

  // Kitchen & Dispatch Tasks
  KITCHEN_TASKS.forEach((template) => {
    tasks.push({
      eventId: event.orderId,
      taskId: template.id,
      name: template.name,
      owner: template.owner,
      support: '',
      phase: template.phase,
      plannedDate: event.eventDate,
      plannedTime: template.plannedTime,
      actualTime: '',
      delay: 0,
      status: STATUS.NOT_STARTED,
      remarks: '',
      step: 0,
    });
  });

  // 15-Step Execution Tasks
  EXECUTION_TASKS.forEach((template) => {
    tasks.push({
      eventId: event.orderId,
      taskId: template.id,
      name: template.name,
      owner: template.owner,
      support: template.support,
      phase: PHASES.EXECUTION,
      plannedDate: event.eventDate,
      plannedTime: template.plannedTime,
      actualTime: '',
      delay: 0,
      status: STATUS.NOT_STARTED,
      remarks: '',
      step: template.step,
      dependsOn: template.dependsOn || null,
    });
  });

  write(KEYS.TASKS, tasks);
};

// ==========================================
// VENDORS
// ==========================================
export const getVendors = () => read(KEYS.VENDORS);

export const createVendor = (data) => {
  const vendors = getVendors();
  const vendor = {
    id: `VND-${String(vendors.length + 1).padStart(3, '0')}`,
    ...data,
    createdAt: new Date().toISOString(),
  };
  vendors.push(vendor);
  write(KEYS.VENDORS, vendors);
  return vendor;
};

export const updateVendor = (id, updates) => {
  const vendors = getVendors();
  const idx = vendors.findIndex((v) => v.id === id);
  if (idx === -1) return null;
  vendors[idx] = { ...vendors[idx], ...updates };
  write(KEYS.VENDORS, vendors);
  return vendors[idx];
};

export const deleteVendor = (id) => {
  const vendors = getVendors().filter((v) => v.id !== id);
  write(KEYS.VENDORS, vendors);
};

// ==========================================
// INVENTORY
// ==========================================
export const getInventory = () => read(KEYS.INVENTORY);

export const createInventoryItem = (data) => {
  const items = getInventory();
  const item = {
    id: `INV-${String(items.length + 1).padStart(3, '0')}`,
    ...data,
    createdAt: new Date().toISOString(),
  };
  items.push(item);
  write(KEYS.INVENTORY, items);
  return item;
};

export const updateInventoryItem = (id, updates) => {
  const items = getInventory();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...updates };
  write(KEYS.INVENTORY, items);
  return items[idx];
};

// ==========================================
// DASHBOARD STATS
// ==========================================
export const getDashboardStats = () => {
  const events = getEvents();
  const tasks = getAllTasks();
  const today = getToday();

  const totalEvents = events.length;
  const todayEvents = events.filter((e) => e.eventDate === today).length;
  const upcomingEvents = events.filter((e) => e.eventDate > today && e.status !== EVENT_STATUS.COMPLETED).length;
  const completedEvents = events.filter((e) => e.status === EVENT_STATUS.COMPLETED).length;

  const completedTasks = tasks.filter((t) => t.status === STATUS.COMPLETED);
  const delayedTasks = tasks.filter((t) => t.status === STATUS.DELAYED);
  const totalTasksWithTime = completedTasks.length + delayedTasks.length;
  const onTimePercent = totalTasksWithTime > 0
    ? Math.round((completedTasks.filter(t => t.delay <= 0).length / totalTasksWithTime) * 100)
    : 100;

  const avgDelay = delayedTasks.length > 0
    ? Math.round(delayedTasks.reduce((sum, t) => sum + (t.delay || 0), 0) / delayedTasks.length)
    : 0;

  return {
    totalEvents,
    todayEvents,
    upcomingEvents,
    completedEvents,
    onTimePercent,
    avgDelay,
    totalTasks: tasks.length,
    completedTasksCount: completedTasks.length,
    delayedTasksCount: delayedTasks.length,
    pendingTasks: tasks.filter((t) => t.status === STATUS.NOT_STARTED).length,
    inProgressTasks: tasks.filter((t) => t.status === STATUS.IN_PROGRESS).length,
  };
};

// --- Event progress ---
export const getEventProgress = (orderId) => {
  const tasks = getTasksForEvent(orderId);
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.status === STATUS.COMPLETED).length;
  return Math.round((completed / tasks.length) * 100);
};
