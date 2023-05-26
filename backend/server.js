var express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const payrouter = require("./routes/payment");

console.log("Starting server....");

const app = express();
app.use(cors());
//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", function (req, res) {
  res.send("Hello world!");
});

app.use("/api/payment", payrouter);

app.listen(5000);
