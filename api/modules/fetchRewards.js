import axios from "axios";
import data from "../data/data.js";
import checkAvailability from "./checkAvailability.js";
import writeToSheet from "./writeToSheet.js";

// import fs from "fs";

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
        // create a data.js file to get data object from server
        // const jsContent = `const data = ${JSON.stringify(
        //   response.data.Result.Obj,
        //   null,
        //   2
        // )}`;
        // fs.writeFileSync("datas.js", jsContent, "utf-8");
        // console.log(response.data.Result.Obj);

        rewardsArray.push({
          country: data[index].country,
          dataArray: extractedRewards,
        });
      } else {
        console.log(`No valid data found for ${data[index].country}`);
      }
    });

    // Get formatted data for Google Sheets & send notifications
    const { sheetData1, sheetData2 } = checkAvailability(rewardsArray);
    console.log(sheetData1);

    // Write to Google Sheets
    await writeToSheet(sheetData1, sheetData2);
  } catch (error) {
    console.error("❌ Error fetching data:", error.message);
  }
};

export default fetchRewards;
