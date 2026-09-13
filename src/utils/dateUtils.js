import { URGENCY_LEVELS } from './constants';

/**
 * Format a Date or date string to YYYY-MM-DD
 */
export const toISODateString = (dateInput) => {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parses YYYY-MM-DD string into local midnight Date
 */
export const parseLocalDate = (dateStr) => {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Friendly Spanish date formatting (e.g. "Lun, 15 sep" or "15 de septiembre")
 */
export const formatDateSpanish = (dateStr, options = { short: true }) => {
  if (!dateStr) return '';
  const date = parseLocalDate(dateStr);
  
  if (options.short) {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  }

  return date.toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Calculates calendar day difference relative to TODAY (00:00:00)
 */
export const getDaysDifferenceFromToday = (dueStr) => {
  if (!dueStr) return 999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = parseLocalDate(dueStr);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
  return diffDays;
};

/**
 * Determines Urgency Level for an activity
 */
export const getUrgencyInfo = (activity) => {
  if (activity.status === 'Finalizada') {
    return { ...URGENCY_LEVELS.COMPLETED, daysDiff: getDaysDifferenceFromToday(activity.due_date), badgeText: 'Finalizada' };
  }

  const diffDays = getDaysDifferenceFromToday(activity.due_date);

  if (diffDays < 0) {
    const daysAgo = Math.abs(diffDays);
    return {
      ...URGENCY_LEVELS.OVERDUE,
      daysDiff: diffDays,
      badgeText: `Vencida hace ${daysAgo} d${daysAgo === 1 ? 'ía' : 'ías'}`
    };
  }

  if (diffDays === 0) {
    return {
      ...URGENCY_LEVELS.URGENT,
      daysDiff: diffDays,
      badgeText: 'Vence hoy'
    };
  }

  if (diffDays === 1) {
    return {
      ...URGENCY_LEVELS.URGENT,
      daysDiff: diffDays,
      badgeText: 'Vence mañana'
    };
  }

  if (diffDays <= 3) {
    return {
      ...URGENCY_LEVELS.PROXIMA,
      daysDiff: diffDays,
      badgeText: `Vence en ${diffDays} días`
    };
  }

  return {
    ...URGENCY_LEVELS.NORMAL,
    daysDiff: diffDays,
    badgeText: `Vence el ${formatDateSpanish(activity.due_date, { short: true })}`
  };
};

/**
 * Returns calendar days for month grid starting Monday (ISO 8601)
 */
export const getMonthGrid = (year, monthIndex) => {
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

  // Get day of week for 1st of month: 0=Sun, 1=Mon... convert so Mon=0, Sun=6
  let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;

  const totalDays = lastDayOfMonth.getDate();
  const grid = [];

  // Previous month padding
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const prevMonthDate = new Date(year, monthIndex - 1, day);
    grid.push({
      dateStr: toISODateString(prevMonthDate),
      dayNumber: day,
      isCurrentMonth: false,
      isToday: false
    });
  }

  // Current month days
  const todayStr = toISODateString(new Date());
  for (let d = 1; d <= totalDays; d++) {
    const currDate = new Date(year, monthIndex, d);
    const dateStr = toISODateString(currDate);
    grid.push({
      dateStr,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr
    });
  }

  // Next month padding to fill complete weeks (multiples of 7)
  const remainingCells = 42 - grid.length; // 6 rows * 7 days
  for (let n = 1; n <= remainingCells; n++) {
    const nextMonthDate = new Date(year, monthIndex + 1, n);
    grid.push({
      dateStr: toISODateString(nextMonthDate),
      dayNumber: n,
      isCurrentMonth: false,
      isToday: false
    });
  }

  return grid;
};

/**
 * Returns month label in Spanish
 */
export const getMonthName = (monthIndex) => {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return monthNames[monthIndex];
};
