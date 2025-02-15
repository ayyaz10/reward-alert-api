// import { DateTime } from "luxon";
// const currentTime = DateTime.now()
//   .setZone("Asia/Karachi")
//   .setLocale("ur-PK")
//   .toFormat("HH:mm:ss, dd-MM-yyyy");

// export default currentTime;
const date = new Date();
const timeOptions = {
  timeZone: "Asia/Karachi",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
};

const dateOptions = {
  timeZone: "Asia/Karachi",
  year: "numeric",
  month: "2-digit",
  day: "numeric",
};

const time = date.toLocaleString("en-PK", timeOptions);
const formattedDate = date.toLocaleString("en-PK", dateOptions);

export { time, formattedDate };
