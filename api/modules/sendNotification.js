import fetch from "node-fetch";

const url = "https://api.onesignal.com/notifications?c=push";

const sendNotification = (country, reward) => {
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
    }),
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(`📢 Notification sent for ${country}:`, json))
    .catch((err) => console.error("❌ Error sending notification:", err));
};

export default sendNotification;
