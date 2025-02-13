import sheets from "./sheets.js";
import time from "./time.js";
const SPREADSHEET_ID = "11lHlSReAfoOkDlyosy8XHO4ivfgCJHqnmcBUwVctYmI";

const writeToSheet = async (sheetData1, sheetData2) => {
  const currentTime = new Date(Date.now())
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  try {
    const countryLiveDataRequest = {
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A2",
      valueInputOption: "RAW",
      resource: { values: sheetData1 },
    };
    const countryRecordDataRequest = {
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet2!A2",
      valueInputOption: "RAW",
      resource: { values: sheetData2 },
    };

    const statusSheetData = [
      ["Status", "Last Checked"],
      ["Time", time],
    ];
    const statusRequest = {
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!G2",
      valueInputOption: "RAW",
      resource: { values: statusSheetData },
    };

    await sheets.spreadsheets.values.update(countryLiveDataRequest);
    await sheets.spreadsheets.values.append(countryRecordDataRequest);
    await sheets.spreadsheets.values.update(statusRequest);
    console.log("✅ Successfully updated Google Sheet!");
  } catch (error) {
    console.error("❌ Error writing to Google Sheet:", error.message);
  }
};

export default writeToSheet;
