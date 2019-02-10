const app = require("express")();
const cors = require("cors");
const axios = require("axios");
const http = require("http");
const socketIO = require("socket.io");
require("dotenv").config();

const BASE_URL =
  "https://www.googleapis.com/youtube/v3/channels?part=statistics";
// search for channel_id on channel page
const PEWDIEPIE_ID = "UC-lHJZR3Gqxm24_Vd_AJ5Yw";
const TSERIES_ID = "UCq-Fj5jknLsUf-MWSy4_brA";

const PEWDIEPIE_ENDPOINT = `${BASE_URL}&id=${PEWDIEPIE_ID}&key=${
  process.env.API_KEY
}`;
const TSERIES_ENDPOINT = `${BASE_URL}&id=${TSERIES_ID}&key=${
  process.env.API_KEY
}`;

const server = http.Server(app);
const io = socketIO(server);

app.use(cors());

let stats;
const getStats = async () => {
  try {
    const [{ data: pewdiepie }, { data: tseries }] = await Promise.all([
      axios(PEWDIEPIE_ENDPOINT),
      axios(TSERIES_ENDPOINT)
    ]);
    stats = {
      pewdiepieStats: pewdiepie.items[0].statistics,
      tseriesStats: tseries.items[0].statistics
    };
    io.emit("stats", stats);
    setTimeout(() => getStats(), 2500);
  } catch (err) {
    console.log("Error connecting to Youtube API", err.message);
    setTimeout(() => getStats(), 2500);
  }
};
getStats();

// app.get("/", (req, res) => {
//   res.json({ message: "Hello World!" });
// });

app.get("/stats", (req, res) => {
  res.json(stats);
});

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Listening on port ${port}`));
