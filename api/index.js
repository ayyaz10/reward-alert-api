import fetchRewards from "./modules/fetchRewards.js";
import readSheet from "./modules/readSheet.js";
import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "https://test.microstun.com"],
    methods: ["GET"],
    allowedHeaders: ["Content-Type"],
  })
);

app.get("/api", async (req, res) => {
  await fetchRewards();
  const obj = await readSheet();
  res.json(obj);
});
// fetchRewards();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
