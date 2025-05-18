import fetchRewards from "./modules/fetchRewards.js";
import readSheet from "./modules/readSheet.js";
import express from "express";
import bodyParser from "body-parser";
import sheets from "./modules/sheets.js";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "https://test.microstun.com",
      "https://gsf.guesssolutions.com",
      "https://shopbond.nyc",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.get("/api", async (req, res) => {
  await fetchRewards();
  const obj = await readSheet();
  res.json(obj);
});
// fetchRewards();

// shopbond
const writeToSheet = async (sheetData) => {
  try {
    // Set up Google Sheets authentication
    // const auth = new google.auth.GoogleAuth({
    //   credentials: {
    //     client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    //     private_key: process.env.AUTHORIZATION.replace(/\\n/g, "\n"),
    //   },
    //   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    // });

    // const client = await auth.getClient();
    // const sheets = google.sheets({ version: "v4", auth: client });

    // Append data to the sheet - similar to your writeToSheet function
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: "1ccLM5WMAxNoAzlwE5Xb6PATUd8-k2ELC7KW7U_sTi2A",
      range: "Sheet1!A:C",
      valueInputOption: "RAW",
      // insertDataOption: "INSERT_ROWS",
      resource: {
        values: sheetData,
      },
    });

    console.log("✅ Data successfully written to Google Sheet:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error writing to Google Sheet:", error);
    throw new Error(`Failed to write to Google Sheet: ${error.message}`);
  }
};

// API endpoint to receive form submissions
app.post("/contact-submit", async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;
    console.log(name, phoneNumber); // Basic validation
    if (!name || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Name and phone number are required",
      });
    }

    // Validate phone number format
    const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
      });
    }

    // Format data for Google Sheets - Similar to your approach
    const timestamp = new Date().toISOString();
    const sheetData = [[timestamp, name, phoneNumber]];

    // Write to Google Sheets - Using your method approach
    await writeToSheet(sheetData);

    console.log(`✅ Form submission for ${name} processed successfully`);

    res.status(200).json({
      success: true,
      message: "Form submitted successfully",
    });
  } catch (error) {
    console.error("❌ Error processing form submission:", error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
});

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
