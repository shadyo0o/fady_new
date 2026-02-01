/**
 * Smart Date-based Grouping Utility for Vaccines
 * Groups vaccines by their scheduled date and creates "Visit Packages"
 */

/**
 * Parse Arabic date strings to Date objects
 * @param {string} dateString - Arabic or standard date string
 * @returns {Date|null} - Parsed date or null
 */
export const parseArabicDate = (dateString) => {
  if (!dateString) return null;
  if (dateString instanceof Date && !isNaN(dateString.getTime())) return dateString;
  
  const standardDate = new Date(dateString);
  if (!isNaN(standardDate.getTime())) return standardDate;

  const arabicMonths = {
    'يناير': 0, 'فبراير': 1, 'مارس': 2, 'أبريل': 3, 'مايو': 4, 'يونيو': 5,
    'يوليو': 6, 'أغسطس': 7, 'سبتمبر': 8, 'أكتوبر': 9, 'نوفمبر': 10, 'ديسمبر': 11,
    'كانون الثاني': 0, 'شباط': 1, 'آذار': 2, 'نيسان': 3, 'أيار': 4, 'حزيران': 5,
    'تموز': 6, 'آب': 7, 'أيلول': 8, 'تشرين الأول': 9, 'تشرين الثاني': 10, 'كانون الأول': 11
  };

  for (const [monthName, monthIndex] of Object.entries(arabicMonths)) {
    if (dateString.includes(monthName)) {
      const parts = dateString.match(/(\d+)\s*(?:من\s*)?(\S+)\s+(\d+)/);
      if (parts) {
        const day = parseInt(parts[1]);
        const year = parseInt(parts[3]);
        const date = new Date(year, monthIndex, day);
        if (!isNaN(date.getTime())) return date;
      }
    }
  }

  const slashMatch = dateString.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (slashMatch) {
    const day = parseInt(slashMatch[1]);
    const month = parseInt(slashMatch[2]) - 1;
    const year = parseInt(slashMatch[3]);
    const date = new Date(year, month, day);
    if (!isNaN(date.getTime())) return date;
  }
  return null;
};

/**
 * Normalize date string for comparison (YYYY-MM-DD format)
 * @param {string|Date} dateValue - Date to normalize
 * @returns {string} - Normalized date string (YYYY-MM-DD)
 */
export const normalizeDateForComparison = (dateValue) => {
  const parsedDate = parseArabicDate(dateValue);
  if (!parsedDate) return '';
  
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const day = String(parsedDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Group vaccines by their scheduled date
 * @param {Array} nextVaccines - Array of vaccine objects
 * @param {Object} nextTask - Primary task object (next vaccine)
 * @returns {Object} - Grouped visit package data
 */
export const createVisitPackage = (nextVaccines = [], nextTask = null) => {
  if (!nextTask && (!nextVaccines || nextVaccines.length === 0)) {
    return null;
  }

  const primaryVaccine = nextTask || (nextVaccines.length > 0 ? nextVaccines[0] : null);
  if (!primaryVaccine) return null;

  const primaryDate = normalizeDateForComparison(primaryVaccine.date);
  if (!primaryDate) return null;

  // Find all vaccines with the same date
  const vaccinesOnSameDate = nextVaccines.filter(v => 
    normalizeDateForComparison(v.date) === primaryDate
  );

  // If the nextTask is not in nextVaccines, add it to the group
  const allVaccinesInPackage = [];
  let primaryIncluded = false;

  if (nextTask) {
    allVaccinesInPackage.push(nextTask);
    primaryIncluded = true;
  }

  // Add other vaccines on the same date
  for (const vaccine of vaccinesOnSameDate) {
    if (!primaryIncluded || vaccine.title !== primaryVaccine.title) {
      allVaccinesInPackage.push(vaccine);
    }
  }

  // Find unavailable vaccines (especially BCG - الدرن)
  const unavailableVaccines = allVaccinesInPackage.filter(v => v.isAvailable === false);
  
  // Check specifically for BCG warnings
  const bcgWarning = allVaccinesInPackage.find(v => 
    (v.title?.includes('الدرن') || v.title?.includes('BCG')) && v.isAvailable === false
  );

  // Ensure each vaccine has required fields for independent recording
  const enrichedVaccines = allVaccinesInPackage.map(v => ({
    ...v,
    // Use scheduleId if available, otherwise use title as fallback
    scheduleId: v.scheduleId || v.id || v._id || `${v.title}-${primaryDate}`,
  }));

  return {
    date: primaryVaccine.date,
    day: primaryVaccine.day || primaryVaccine.dayName,
    vaccineTitles: enrichedVaccines.map(v => v.title),
    vaccineCount: enrichedVaccines.length,
    advice: primaryVaccine.advice,
    warning: primaryVaccine.warning,
    unavailableVaccines: unavailableVaccines,
    bcgWarning: bcgWarning ? bcgWarning.warning || 'تطعيم الدرن غير متوفر حالياً' : null,
    allVaccines: enrichedVaccines,
    office: primaryVaccine.office,
    childId: primaryVaccine.childId,
    childName: primaryVaccine.childName,
    daysRemaining: primaryVaccine.daysRemaining,
  };
};

/**
 * Calculate days remaining until visit date
 * @param {string} dateString - Date string to calculate from
 * @returns {number} - Days remaining (0 if date has passed)
 */
export const calculateDaysRemaining = (dateString) => {
  const vaccineDate = parseArabicDate(dateString);
  if (!vaccineDate) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  vaccineDate.setHours(0, 0, 0, 0);
  
  const diffTime = vaccineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays >= 0 ? diffDays : 0;
};
