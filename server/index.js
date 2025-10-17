const express = require("express");
const QRCode = require("qrcode");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "https://urlshortner-cn7p.onrender.com" || `http://localhost:${PORT}`;

app.use(express.json());
app.use(cors());

setInterval(() => {
  fetch("https://urlshortner-cn7p.onrender.com/");
}, 5 * 60 * 1000);

const db = new Map(); 

function hash_url(longUrl) {
  let hash = 0;
  const prime = 31;
  const MOD = 1e9 + 7;
  for (let i = 0; i < longUrl.length; i++) {
    hash = (hash * prime + longUrl.charCodeAt(i)) % MOD;
  }
  return hash;
}

const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function base62(hashKey) {
  let str = "";
  while (hashKey > 0) {
    str = chars[hashKey % 62] + str;
    hashKey = Math.floor(hashKey / 62);
  }
  return str || "0";
}

function shortenUrl(longUrl, aliasData = "") {
  if (aliasData) return aliasData; // custom alias

  let salt = 0;
  let shortCode;

  while (true) {
    const hashValue = hash_url(longUrl + salt);
    shortCode = base62(hashValue).slice(0, 6);

    if (!db.has(shortCode)) break; // unique
    if (db.get(shortCode).longUrl === longUrl) break; // same URL → reuse

    salt++;
  }
  return shortCode;
}

app.post("/create", async (req, res) => {
  try {
    const { longUrl, dateExpiry } = req.body;
    if (!longUrl) return res.status(400).json({ error: "longUrl is required" });

    const shortUrl = shortenUrl(longUrl);
    const registerDate = new Date();

    db.set(shortUrl, { longUrl, dateExpiry, registerDate });
    const qr = await QRCode.toDataURL(`${HOST}/${shortUrl}`);

    res.json({ shortUrl, qr, longUrl, dateExpiry, registerDate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/create/shorturl", async (req, res) => {
  try {
    const { longUrl, shortUrl: aliasData, dateExpiry } = req.body;
    if (!longUrl || !aliasData)
      return res.status(400).json({ error: "longUrl and shortUrl required" });

    if (db.has(aliasData)) {
      return res.status(400).json({ error: "Alias already registered." });
    }

    db.set(aliasData, { longUrl, dateExpiry, registerDate: new Date() });
    const qr = await QRCode.toDataURL(`${HOST}/${aliasData}`);

    res.json({ shortUrl: aliasData, qr, longUrl, dateExpiry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/:shortUrl", (req, res) => {
  const { shortUrl } = req.params;
  if (!db.has(shortUrl)) return res.status(404).send("Page not found");

  const { longUrl, dateExpiry } = db.get(shortUrl);
  const now = new Date().getTime();
  const expiry = dateExpiry ? new Date(dateExpiry).getTime() : Infinity;

  if (now < expiry) {
    console.log("Redirecting to:", longUrl);
    return res.redirect(longUrl);
  } else {
    return res.send("URL has expired. Bad luck.");
  }
});

app.get("/list", (req, res) => {
  const allData = [];
  db.forEach((value, key) => {
    allData.push({
      shortUrl: key,
      longUrl: value.longUrl,
      dateExpiry: value.dateExpiry,
      registerDate: value.registerDate,
    });
  });
  res.json(allData);
});

app.get("/", (req, res) => {
  res.send(`Working`);
});

app.listen(PORT, () => console.log(`Server running at ${HOST}`));
