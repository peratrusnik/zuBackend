const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: "string",
      required: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now
    },
  }
);

const NewsletterModel = mongoose.model("subscribe", newsletterSchema);

module.exports = NewsletterModel;