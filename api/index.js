const express = require("express");
const path = require("path");
const fs = require("fs");
const { google } = require("googleapis");
const axios = require("axios");
const data = require("../data/data.js");
const cron = require("node-cron");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = "4000";

app.use(
  cors({
    origin: ["http://localhost:5500", "https://test.microstun.com"],
    methods: ["GET", "POST"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

const url = "https://api.onesignal.com/notifications?c=push";
const credentialsPath = path.resolve(__dirname, "../credentials.json");
const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));

const SPREADSHEET_ID = "11lHlSReAfoOkDlyosy8XHO4ivfgCJHqnmcBUwVctYmI";

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const transformData = (sheetData) => {
  const headers = sheetData[0]; // Extract headers (first row)
  return sheetData.slice(1).map((row) => {
    let obj = {};
    headers.forEach((key, index) => {
      obj[key.split(" ").join("")] = row[index]; // Assign each column value to its respective key
    });
    return obj;
  });
};

async function readSheet() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1",
  });
  const obj = transformData(res.data.values);
  return obj;
}

async function writeToSheet(sheetData) {
  try {
    const request = {
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A2", // Assuming first row has headers
      valueInputOption: "RAW",
      resource: { values: sheetData },
    };

    await sheets.spreadsheets.values.update(request);
    console.log("✅ Successfully updated Google Sheet!");
  } catch (error) {
    console.error("❌ Error writing to Google Sheet:", error.message);
  }
}

cron.schedule("0,15,30,45 * * * *", () => {
  console.log("Running API call at:", new Date().toLocaleTimeString());
  fetchRewards();
});

function sendNotification(country, reward) {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization:
        "os_v2_app_ahndqvk5xvf25ivf57sgybo7abpisqvcipteban2wnzaoivnt474cb3kov6djxvy6jcih5brkqkelghc6iosfbrsfunai2angara6aq",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      app_id: "01da3855-5dbd-4bae-a2a5-efe46c05df00",
      contents: {
        en: `🤑 New reward available! ${reward} points from ${country}! 🎉`,
      },
      included_segments: ["All"],
      big_picture: "https://i.imgur.com/DFyfxv6.png", // Add image URL for Android
      chrome_web_icon: "https://i.imgur.com/DFyfxv6.png", // Icon for Chrome (Windows)
      chrome_web_image: "https://i.imgur.com/r2pLKRj.jpeg",
      ios_attachments: {
        id: "image_id",
        url: "https://i.imgur.com/DFyfxv6.png",
      },
    }),
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(`📢 Notification sent for ${country}:`, json))
    .catch((err) => console.error("❌ Error sending notification:", err));
}

function checkAvailability(rogData) {
  const result = {
    status: "ok",
    data: [],
  };

  const sheetData = [];

  rogData.forEach((each) => {
    const now = new Date().toLocaleTimeString("en-US");

    const has400 = each.dataArray.some(
      (reward) =>
        reward.Point === 500 && reward.Status === 1 && reward.RewardType === 2
    );

    const has200 = each.dataArray.some(
      (reward) =>
        reward.Point === 200 && reward.Status === 1 && reward.RewardType === 2
    );

    const status = has400 || has200 ? "Easy scene 🤑" : "Easy scene 😰";

    // Create a single row with both rewards in the same row
    const row = [
      each.country, // Country
      status, // Status (🤑 if any reward is available)
      has400 ? "400" : "", // Show 400 if available, else empty
      has200 ? "200" : "", // Show 200 if available, else empty
      now, // Timestamp
    ];

    sheetData.push(row);

    // Store in result object
    result.data.push({
      country: each.country,
      status: status,
      reward: `${has400 ? "400 " : ""}${has200 ? "200" : ""}`.trim(), // Combine available rewards
      time: now,
    });

    if (has400 || has200) {
      // console.log(`${has400 ? has400 : ""} ${has200 ? has200 : ""} available`);
      sendNotification(
        each.country,
        `${has400 ? "400" : ""} ${has200 ? "200" : ""}`.trim()
      );
    }
  });

  // console.log("Final Availability Data:", JSON.stringify(result, null, 2));
  return sheetData; // Return data formatted for Google Sheets
}

const fetchRewards = async () => {
  const rewardsArray = [];
  try {
    const responses = await Promise.all(
      data.map((item) => axios.get(item.url, { headers: item.header }))
    );

    responses.forEach((response, index) => {
      if (response.data && response.data.Result.Obj) {
        const extractedRewards = response.data.Result.Obj.map((reward) => ({
          RewardType: reward.RewardType,
          Status: reward.Status,
          Point: reward.Point,
        }));

        rewardsArray.push({
          country: data[index].country,
          dataArray: extractedRewards,
        });
      } else {
        console.log(`No valid data found for ${data[index].country}`);
      }
    });

    // Get formatted data for Google Sheets & send notifications
    const sheetData = checkAvailability(rewardsArray);
    console.log(sheetData);

    // Write to Google Sheets
    await writeToSheet(sheetData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};

// fetchRewards();
// app.get("/", async (req, res) => {
//   res.send("hello world");
// });
app.get("/api", async (req, res) => {
  console.log("notify client");

  await fetchRewards();
  const obj = await readSheet();
  res.json(obj);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
