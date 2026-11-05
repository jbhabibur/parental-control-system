import mongoose from "mongoose";

const browserHistorySchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    domain: {
      type: String,
      required: true,
      lowercase: true,
    },

    pageTitle: {
      type: String,
      default: null,
    },

    category: {
      type: String,
      enum: ["SAFE", "ADULT", "GAMBLING", "MALWARE", "PHISHING", "OTHER"],
      default: "OTHER",
    },

    action: {
      type: String,
      enum: ["ALLOWED", "BLOCKED"],
      required: true,
    },

    blockReason: {
      type: String,
      default: null,
    },

    visitedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

browserHistorySchema.index({ childId: 1, visitedAt: -1 });
browserHistorySchema.index({ deviceId: 1, domain: 1 });

const BrowserHistory = mongoose.model("BrowserHistory", browserHistorySchema);

export default BrowserHistory;
