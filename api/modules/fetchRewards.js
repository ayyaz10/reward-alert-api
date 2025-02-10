import axios from "axios";
import data from "../data/data.js";
import checkAvailability from "./checkAvailability.js";
import writeToSheet from "./writeToSheet.js";

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
    console.error("❌ Error fetching data:", error.message);
  }
};

export default fetchRewards;
