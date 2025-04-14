const express = require("express");
const router = express.Router();
const Url = require("../Models/Urls");
var cors = require("cors");
router.use(cors());

router.use(express.json());

router.get("/:params", async (req, res) => {
  const params = req.params["params"];
  const l = await Url.findOne({ shortUrl: params });

  if (l) {
    console.log("Redirect to :", l.longUrl);
    res.redirect(l.longUrl)
  } else {
    res.send("Not Found");
  }
});

module.exports = router;