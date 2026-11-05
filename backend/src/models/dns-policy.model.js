import mongoose from "mongoose";

const dnsPolicySchema = new mongoose.Schema(
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

    protocol: {
      type: String,
      enum: ["DOH", "DOT"],
      required: true,
    },

    dnsEndpoint: {
      type: String,
      required: true,
    },

    blockedCategories: [
      {
        type: String,
        enum: ["ADULT", "GAMBLING", "MALWARE", "PHISHING"],
      },
    ],

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

dnsPolicySchema.index({ childId: 1, deviceId: 1 }, { unique: true });

const DnsPolicy = mongoose.model("DnsPolicy", dnsPolicySchema);

export default DnsPolicy;
