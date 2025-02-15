import sendNotification from "./sendNotification.js";
// import time from "./time.js";
import { DateTime } from "luxon";

const currentTime = DateTime.now()
  .setZone("Asia/Karachi")
  .setLocale("ur-PK")
  .toFormat("HH:mm:ss, dd-MM-yyyy");

const checkAvailability = (rogData) => {
  const result = {
    status: "ok",
    data: [],
  };
  // const currentTime = new Date(Date.now())
  //   .toISOString()
  //   .slice(0, 19)
  //   .replace("T", " ");
  const sheetData1 = [];
  const sheetData2 = [];

  rogData.forEach((each) => {
    const has400 = each.dataArray.some(
      (reward) =>
        reward.Point === 400 && reward.Status === 1 && reward.RewardType === 2
    );

    const has200 = each.dataArray.some(
      (reward) =>
        reward.Point === 200 && reward.Status === 1 && reward.RewardType === 2
    );

    const status = has400 || has200 ? "Easy scene 🤑" : "Easy scene 😰";

    const row = [
      each.country,
      status,
      has400 ? "400" : "",
      has200 ? "200" : "",
      currentTime,
    ];
    sheetData1.push(row);

    result.data.push({
      country: each.country,
      status: status,
      reward: `${has400 ? "400 " : ""}${has200 ? "200" : ""}`.trim(),
      time: currentTime,
    });

    if (has400 || has200) {
      sheetData2.push(row);
      sendNotification(
        each.country,
        `${has400 ? "400" : ""} ${has200 ? "200" : ""}`.trim()
      );
    }
  });

  return { sheetData1, sheetData2 };
};

export default checkAvailability;
