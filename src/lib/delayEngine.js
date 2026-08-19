// ============================================
// DELAY ENGINE — Auto-detect overdue tasks
// Runs on interval, marks tasks as DELAYED
// ============================================

import { getAllTasks, updateTask } from './dataService';
import { STATUS, getCurrentTime, getToday } from './constants';

export const checkDelays = () => {
  const tasks = getAllTasks();
  const currentTime = getCurrentTime();
  const today = getToday();
  const [ch, cm] = currentTime.split(':').map(Number);
  const currentMinutes = ch * 60 + cm;
  let delayedCount = 0;

  tasks.forEach((task) => {
    // Only check tasks for today that are not completed and not already delayed
    if (
      task.plannedDate === today &&
      task.plannedTime &&
      task.status !== STATUS.COMPLETED &&
      task.status !== STATUS.NOT_STARTED
    ) {
      const [ph, pm] = task.plannedTime.split(':').map(Number);
      const plannedMinutes = ph * 60 + pm;

      if (currentMinutes > plannedMinutes && task.status !== STATUS.DELAYED) {
        const delayMins = currentMinutes - plannedMinutes;
        updateTask(task.eventId, task.taskId, {
          status: STATUS.DELAYED,
          delay: delayMins,
        });
        delayedCount++;
      }
    }
  });

  return delayedCount;
};

// Start the delay engine with interval
let intervalId = null;

export const startDelayEngine = (intervalMs = 60000) => {
  if (intervalId) clearInterval(intervalId);
  // Run immediately
  checkDelays();
  // Then run on interval
  intervalId = setInterval(checkDelays, intervalMs);
  return intervalId;
};

export const stopDelayEngine = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};
