const express = require("express");
const bodyParser = require("body-parser");
const FormData = require("form-data");
const fetch = require("node-fetch");
var http = require("http");
const { client_id, redirect_uri, client_secret } = require("./config");
let accesstoken;

const config = require("./config");

const app = express();
const { REACT_APP_TOKEN } = process.env;
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "text/*" }));
app.use(bodyParser.urlencoded({ extended: false }));

// Enabled Access-Control-Allow-Origin", "*" in the header so as to by-pass the CORS error.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.post("/authenticate", (req, res) => {
  console.log("authenticate called");
  const { code } = req.body;

  const data = new FormData();
  data.append("client_id", client_id);
  data.append("client_secret", client_secret);
  data.append("code", code);
  data.append("redirect_uri", redirect_uri);

  // Request to exchange code for an access token
  fetch(`https://github.com/login/oauth/access_token`, {
    method: "POST",
    body: data,
  })
    .then((response) => response.text())
    .then((paramsString) => {
      let params = new URLSearchParams(paramsString);
      const access_token = params.get("access_token");
      accesstoken = access_token;
      process.env.REACT_APP_TOKEN = params.get("access_token");
      console.log("Access token", params.get("access_token"));
      console.log("code", code);

      // res.send(accesstoken);
      // localStorage.setItem("access_token", accesstoken);
      // Request to return data of a user that has been authenticated
      return fetch(`https://api.github.com/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });
    })
    .then((response) => response.json())
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
});

http.createServer(function (req, res) {
  res.setHeader("Content-Type", "application/json");

  res.end(
    JSON.stringify({
      access_token: access_token,
    })
  );
});
app.get("/", (req, res) => {});

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
module.exports = { accesstoken };
