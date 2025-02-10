import fetchRewards from "./modules/fetchRewards.js";

export default async function handler(req, res) {
  try {
    console.log("Received a request from:", req.headers["user-agent"]);
    console.log("IP Address:", req.headers["x-forwarded-for"]);
    await fetchRewards();

    res.status(200).json({ success: true, message: "Cron job executed" });
  } catch (error) {
    console.error("Cron job error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error executing cron job" });
  }
}
