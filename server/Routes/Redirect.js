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

    const currDate = new Date().getTime();    
    const expiry = new Date(l.dateExpiry).getTime();
    if (currDate < expiry) {
      res.redirect(l.longUrl);
    } else {
      res.send("Url has been expired.! Bad Luck.");
    }
  } else {
    res.send("Page not Found");
  }
});

module.exports = router;
