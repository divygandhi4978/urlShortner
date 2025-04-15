const express = require("express");
const router = express.Router();
const Url = require("../Models/Urls");
const { nanoid } = require("nanoid");
var QRCode = require("qrcode");
var cors = require("cors");

router.use(express.json());

router.use(cors());
router.post("/", async (req, res) => {
  const body = req.body;

  const shorturl = nanoid(8);
  await Url.insertOne({ ...body, shortUrl: shorturl });
  const QR = await QRCode.toDataURL(`${process.env.host}/${shorturl}`);

  console.log({ shortUrl: shorturl, qr: QR });

  res.json({ shortUrl: shorturl, qr: QR });
});

router.post("/shorturl", async (req, res) => {
  const body = req.body;
  const find = await Url.find({ shortUrl: body.shortUrl });

  if (find.length == 1) {
    console.log("Already exist");
    const QR = await QRCode.toDataURL(`${process.env.host}/${body.shortUrl}`);
    res.json({ ...find[0], qr: QR });
  } else {
    const QR = await QRCode.toDataURL(`${process.env.host}/${body.shortUrl}`);
    await Url.insertOne(body);
    res.json({ ...body, qr: QR });
  }
});

module.exports = router;
