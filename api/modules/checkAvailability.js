import sendNotification from "./sendNotification.js";

const checkAvailability = (rogData) => {
  const result = {
    status: "ok",
    data: [],
  };

  const sheetData = [];

  rogData.forEach((each) => {
    const now = new Date().toLocaleTimeString("en-US");

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
      now,
    ];

    sheetData.push(row);

    result.data.push({
      country: each.country,
      status: status,
      reward: `${has400 ? "400 " : ""}${has200 ? "200" : ""}`.trim(),
      time: now,
    });

    if (has400 || has200) {
      sendNotification(
        each.country,
        `${has400 ? "400" : ""} ${has200 ? "200" : ""}`.trim()
      );
    }
  });

  return sheetData;
};

export default checkAvailability;
