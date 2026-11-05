import mongoose from "mongoose";

const browserPolicySchema = new mongoose.Schema(
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

    enabled: {
      type: Boolean,
      default: true,
    },

    filteringMode: {
      type: String,
      enum: ["STRICT", "MODERATE", "CUSTOM"],
      default: "STRICT",
    },

    blockedDomains: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    allowedDomains: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    blockedKeywords: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    safeSearchEnabled: {
      type: Boolean,
      default: true,
    },

    safeSearchProviders: [
      {
        type: String,
        enum: ["GOOGLE", "BING", "YAHOO", "DUCKDUCKGO"],
      },
    ],

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

browserPolicySchema.index({ childId: 1, deviceId: 1 }, { unique: true });

const BrowserPolicy = mongoose.model("BrowserPolicy", browserPolicySchema);

export default BrowserPolicy;
