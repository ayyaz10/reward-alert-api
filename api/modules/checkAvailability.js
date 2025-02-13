import sendNotification from "./sendNotification.js";
import time from "./time.js";
const checkAvailability = (rogData) => {
  const result = {
    status: "ok",
    data: [],
  };

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
      time,
    ];
    sheetData1.push(row);

    result.data.push({
      country: each.country,
      status: status,
      reward: `${has400 ? "400 " : ""}${has200 ? "200" : ""}`.trim(),
      time: time,
    });
    // console.log(result.data);

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
