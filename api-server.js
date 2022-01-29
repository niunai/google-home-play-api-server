require("dotenv").config();
require("date-utils");
const express = require("express");
const googlehome = require("./google-home-castv2-play");
const app = express();
const cors = require("cors");
const serverPort = process.env.GHP_API_ENDPOINT_PORT;

const urlencodedParser = express.urlencoded({ extended: false });

app.use(cors());

app.post("/play", urlencodedParser, function (req, res) {
  now = new Date().toFormat("YYYY-MM-DD HH24:MI:SS");
  console.log(now);
  if (!req.body) return res.sendStatus(400);
  console.log(req.body);
  const { deviceName, mp3Url, mp3Title } = req.body;
  try {
    googlehome.play(deviceName, mp3Url, mp3Title, function (msg) {
      res.send(msg + ": " + mp3Url);
      console.log(msg + ": " + mp3Url);
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    res.send(err);
  }
});

app.listen(serverPort, function () {
  console.log(`listening ${serverPort} ...`);
});
