const express = require("express");
const querystring = require("querystring");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const router = express.Router();

// login endpoint
router.get("/login", (req, res) => {
  res.redirect(
    `https://accounts.spotify.com/authorize?${querystring.stringify({
      response_type: "code",
      client_id: process.env.SPOTIFY_CLIENT_ID,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    })}`
  );
});

// callback endpoint (taking code from request query & posting a request to spotify.com/api/token)
router.get("/callback", async (req, res) => {
  const { code } = req.query;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
  const grant_type = "authorization_code";

  const basicHeader = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const { data } = await axios.post(
    "https://accounts.spotify.com/api/token",
    querystring.stringify({
      grant_type,
      code,
      redirect_uri,
    }),
    {
      headers: {
        Authorization: `Basic ${basicHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const sessionJWTObject = {
    token: data.access_token,
  };

  req.session.jwt = jwt.sign(sessionJWTObject, process.env.JWT_SECRET_KEY);
  return res.redirect("/");
});

// current-session endpoint verifies if jwt token is in session object, if not, will send back false
router.get("/current-session", (req, res) => {
  jwt.verify(
    req.session.jwt,
    process.env.JWT_SECRET_KEY,
    (err, decodedToken) => {
      if (err || !decodedToken) {
        res.send(false);
      } else {
        res.send(decodedToken);
      }
    }
  );
});

// logout endpoint destorys jwt token which determines the user authenticaion w/ spotify
router.get("/logout", (req, res) => {
  req.session = null;
  res.redirect(`/`);
});

module.exports = router;
