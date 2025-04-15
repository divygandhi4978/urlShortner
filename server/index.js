const express = require("express");
const app = express();
const connect = require("./Connection/connect");
const create = require("./Routes/Create");
const Redirect = require("./Routes/Redirect");
const port = 3000;

var cors = require("cors");
app.use(cors());

require("dotenv").config();

connect();

//routes
app.use("/create", create);
app.use("/", Redirect);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
