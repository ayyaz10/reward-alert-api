import sheets from "./sheets.js";
import transformData from "./transformData.js";

const SPREADSHEET_ID = "11lHlSReAfoOkDlyosy8XHO4ivfgCJHqnmcBUwVctYmI";
async function readSheet() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1",
  });
  const obj = transformData(res.data.values);
  return obj;
}

export default readSheet;
