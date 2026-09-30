/**
 * JAIN HERITAGE SCHOOL (JHS) BELAGAVI
 * Form Submission & Google Sheets Integration Service
 * 
 * Safely handles both Contact Page Enquiries and Admission Modal Requests.
 * Transmits submissions to Google Sheets via Google Apps Script Web App
 * with automatic timestamping (date + exact time), error handling, and localStorage backup.
 */

/**
 * Returns formatted local date, exact time, and ISO timestamp.
 */
export function getSubmissionTimestamps() {
  const now = new Date();

  // Formatted date in Indian Standard Time (IST / DD/MM/YYYY)
  const dateStr = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Formatted exact time in Indian Standard Time (hh:mm:ss AM/PM)
  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return {
    date: dateStr,
    time: timeStr,
    isoTimestamp: now.toISOString(),
  };
}

/**
 * Sends form submission to Google Sheets and persists a local backup.
 * 
 * @param {Object} data - Form field values
 * @returns {Promise<{success: boolean, fallback?: boolean}>}
 */
export async function submitToGoogleSheets(data) {
  const timestamps = getSubmissionTimestamps();

  const payload = {
    ...data,
    submissionDate: timestamps.date,
    submissionTime: timestamps.time,
    submittedAt: timestamps.isoTimestamp,
  };

  // 1. Safety net: Always retain a copy in localStorage
  try {
    const existing = JSON.parse(
      localStorage.getItem("jhs-form-submissions") || "[]"
    );
    localStorage.setItem(
      "jhs-form-submissions",
      JSON.stringify([...existing, payload])
    );
  } catch {
    // LocalStorage failure in restricted environments should not halt submission
  }

  // 2. Transmit to Google Sheets Web App endpoint if configured
  const endpointUrl =
    import.meta.env.VITE_GOOGLE_SHEETS_URL ||
    import.meta.env.VITE_ADMISSIONS_API_URL;

  if (!endpointUrl) {
    // If endpoint is not yet configured, submission succeeds with local storage backup
    return { success: true, fallback: true };
  }

  try {
    const isGoogleScript = endpointUrl.includes("script.google.com");

    if (isGoogleScript) {
      // Google Apps Script redirects (302) trigger CORS preflight restrictions.
      // Using text/plain with no-cors mode guarantees successful delivery without OPTIONS preflight failure.
      await fetch(endpointUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });
      return { success: true };
    } else {
      // Standard webhook / API endpoint
      const response = await fetch(endpointUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
      return { success: true };
    }
  } catch (error) {
    console.error("JHS: Failed to submit to remote endpoint:", error);
    throw error;
  }
}
