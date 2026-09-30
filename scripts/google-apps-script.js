/**
 * ==============================================================================
 * JAIN HERITAGE SCHOOL (JHS) BELAGAVI
 * Google Apps Script - Website Form Submissions Handler
 * ==============================================================================
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open Google Sheets (https://sheets.new) and create a new Spreadsheet.
 * 2. Rename it to "JHS Website Admissions Enquiries".
 * 3. In the top menu, go to: Extensions > Apps Script.
 * 4. Replace any default code in Code.gs with this entire script.
 * 5. Click "Deploy" (top right blue button) > "New deployment".
 * 6. Click the gear icon next to "Select type" and choose "Web app".
 * 7. Set configuration:
 *    - Description: "JHS Website Form Submissions"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone" (REQUIRED so website visitors can submit without Google login)
 * 8. Click "Deploy", review permissions, and authorize your Google account.
 * 9. Copy the "Web app URL" (e.g. https://script.google.com/macros/s/.../exec).
 * 10. Paste this URL into your website's .env file:
 *     VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/.../exec
 * 
 * ==============================================================================
 */

// Name of the tab in Google Sheets where submissions will be saved
var SHEET_NAME = "Submissions";

// Column headers automatically created if the sheet is empty
var HEADERS = [
  "Date",
  "Time",
  "Form Type",
  "Student Name",
  "Parent / Guardian Name",
  "Phone Number",
  "Grade / Class",
  "Message / Questions",
  "ISO Timestamp",
  "Raw Data"
];

/**
 * Initializes header row styling if sheet is newly created.
 * Safe to run directly from the Apps Script "Run" button with zero arguments.
 */
function setupSheet(sheet) {
  if (!sheet) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      Logger.log("⚠️ No active spreadsheet found. If this is a standalone script, make sure it is attached to a Google Sheet via Extensions > Apps Script.");
      return null;
    }
    sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground("#041c2c"); // JHS Deep Navy
    headerRange.setFontColor("#f2c94c"); // JHS Gold
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);

    // Auto-fit column widths
    for (var i = 1; i <= HEADERS.length; i++) {
      sheet.autoResizeColumn(i);
    }
    Logger.log("✅ Headers created and styled successfully in sheet: " + sheet.getName());
  } else {
    Logger.log("ℹ️ Sheet already has " + sheet.getLastRow() + " rows. Headers already present.");
  }
  return sheet;
}

/**
 * Convenience function you can safely select in the toolbar dropdown and click "Run".
 */
function initialSetup() {
  setupSheet();
}

/**
 * Test function you can run directly inside the Apps Script editor:
 * Select "testSubmit" from the function dropdown at the top, then click "Run".
 */
function testSubmit() {
  var mockEvent = {
    postData: {
      contents: JSON.stringify({
        formType: "Test Submission from Apps Script Editor",
        studentName: "Test Student",
        parentName: "Test Parent",
        phone: "9876543210",
        classSelection: "Grade 5",
        message: "This is a test submission to verify Google Sheets integration.",
        submissionDate: Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy"),
        submissionTime: Utilities.formatDate(new Date(), "Asia/Kolkata", "hh:mm:ss a"),
        submittedAt: new Date().toISOString()
      })
    }
  };
  var result = doPost(mockEvent);
  Logger.log("Test result: " + result.getContent());
}

/**
 * Handles incoming POST requests from the website
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 30s to handle simultaneous submissions safely
  try {
    lock.waitLock(30000);
  } catch (lockError) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Server busy, lock timeout"
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }
    setupSheet(sheet);

    // Extract payload data from JSON body or URL-encoded parameters
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    // Exact server date and time (Asia/Kolkata timezone)
    var now = new Date();
    var serverDate = Utilities.formatDate(now, "Asia/Kolkata", "dd/MM/yyyy");
    var serverTime = Utilities.formatDate(now, "Asia/Kolkata", "hh:mm:ss a");

    // Prefer client timestamp with server fallback
    var dateVal = data.submissionDate || serverDate;
    var timeVal = data.submissionTime || serverTime;
    var formTypeVal = data.formType || "Website Form";
    var studentVal = data.studentName || data.student || "";
    var parentVal = data.parentName || data.parent || "";
    var phoneVal = data.phone || data.mobile || "";
    var gradeVal = data.classSelection || data.grade || data.class || "";
    var messageVal = data.message || data.questions || "";
    var isoVal = data.submittedAt || data.isoTimestamp || now.toISOString();

    // Prepare table row
    var row = [
      dateVal,
      timeVal,
      formTypeVal,
      studentVal,
      parentVal,
      "'" + phoneVal, // Prefix with ' to preserve leading 0s and prevent exponential notation
      gradeVal,
      messageVal,
      isoVal,
      JSON.stringify(data)
    ];

    sheet.appendRow(row);

    // Format new row styling
    var lastRow = sheet.getLastRow();
    var rowRange = sheet.getRange(lastRow, 1, 1, HEADERS.length);
    rowRange.setVerticalAlignment("middle");

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Submission stored in Google Sheets successfully",
      date: dateVal,
      time: timeVal
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Health check endpoint for testing deployment in browser
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    service: "JHS Google Sheets Web App Endpoint",
    serverTime: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}
