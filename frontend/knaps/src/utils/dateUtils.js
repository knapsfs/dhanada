/**
 * Date and Time utilities strictly synchronized with Indian Standard Time (IST, Asia/Kolkata).
 * Ensures consistency across calendar views, slot booking, and Frappe backend communication.
 */

const istDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/**
 * Returns today's date formatted as "YYYY-MM-DD" strictly in Asia/Kolkata (IST).
 * @param {Date|null} referenceDate
 * @returns {string} e.g. "2026-11-12"
 */
export const getIstTodayStr = (referenceDate = null) => {
  try {
    const d = referenceDate instanceof Date && !isNaN(referenceDate.getTime()) ? referenceDate : new Date();
    return istDateFormatter.format(d);
  } catch {
    const d = referenceDate instanceof Date && !isNaN(referenceDate.getTime()) ? referenceDate : new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
};

/**
 * Parses any date representation into clean "YYYY-MM-DD" string without timezone shifting.
 * @param {string|Date|null} d
 * @returns {string} e.g. "2026-11-12"
 */
export const formatLocalDate = (d) => {
  if (!d) return "";
  if (typeof d === "string") {
    const clean = d.trim().split("T")[0].split(" ")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
      return clean;
    }
    const parsed = new Date(d);
    if (!isNaN(parsed.getTime())) {
      return getIstTodayStr(parsed);
    }
    return clean;
  }
  if (d instanceof Date && !isNaN(d.getTime())) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return "";
};

/**
 * Creates a local Date object from "YYYY-MM-DD" safely avoiding UTC midnight shifting.
 * @param {string} dateStr
 * @returns {Date}
 */
export const parseLocalDateStr = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") {
    const today = getIstTodayStr();
    const parts = today.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  const parts = dateStr.trim().split("T")[0].split(" ")[0].split("-").map(Number);
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  return new Date();
};

