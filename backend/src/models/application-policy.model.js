import mongoose from "mongoose";

const applicationPolicySchema = new mongoose.Schema(
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

    appIdentifier: {
      type: String,
      required: true,
      trim: true,
    },

    appName: {
      type: String,
      trim: true,
    },

    policy: {
      type: String,
      enum: ["ALLOW", "BLOCK"],
      required: true,
      default: "BLOCK",
    },

    category: {
      type: String,
      enum: [
        "EDUCATION",
        "ENTERTAINMENT",
        "SOCIAL",
        "GAMBLING",
        "ADULT",
        "OTHER",
      ],
      default: "OTHER",
    },

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

applicationPolicySchema.index(
  { deviceId: 1, appIdentifier: 1 },
  { unique: true },
);

const ApplicationPolicy = mongoose.model(
  "ApplicationPolicy",
  applicationPolicySchema,
);

export default ApplicationPolicy;
