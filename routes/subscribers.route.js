const express = require("express");
const NewsletterModel = require("../models/newsletter.model");
const subscribersRoute = express.Router();


subscribersRoute.get("/", function (req, res) {
  try {
    NewsletterModel.find({})
      .then((result) => {
        return res.status(222).send(result);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    res.status(425).send(err);
  }
});

module.exports = subscribersRoute;
