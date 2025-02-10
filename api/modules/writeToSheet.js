import sheets from "./sheets.js";

const SPREADSHEET_ID = "11lHlSReAfoOkDlyosy8XHO4ivfgCJHqnmcBUwVctYmI";

const writeToSheet = async (sheetData) => {
  const currentTime = new Date(Date.now())
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  try {
    const countryDataRequest = {
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A2",
      valueInputOption: "RAW",
      resource: { values: sheetData },
    };
    const statusSheetData = [
      ["Status", "Last Checked"],
      ["Time", currentTime],
    ];
    const statusRequest = {
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!G2",
      valueInputOption: "RAW",
      resource: { values: statusSheetData },
    };
    console.log(statusRequest);

    await sheets.spreadsheets.values.update(countryDataRequest);
    await sheets.spreadsheets.values.update(statusRequest);
    console.log("✅ Successfully updated Google Sheet!");
  } catch (error) {
    console.error("❌ Error writing to Google Sheet:", error.message);
  }
};

export default writeToSheet;
