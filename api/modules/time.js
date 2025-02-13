import { DateTime } from "luxon";
const currentTime = DateTime.now()
  .setZone("Asia/Karachi")
  .setLocale("ur-PK")
  .toFormat("HH:mm:ss, dd-MM-yyyy");

export default currentTime;
