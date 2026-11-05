import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
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

    alertType: {
      type: String,
      enum: [
        "ADULT_CONTENT",
        "GAMBLING",
        "MALWARE",
        "PHISHING",
        "UNAPPROVED_APP",
        "TAMPER_DETECTED",
        "ROOT_DETECTED",
        "JAILBREAK_DETECTED",
        "POLICY_VIOLATION",
      ],
      required: true,
    },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    message: {
      type: String,
      required: true,
    },

    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    notificationSentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

alertSchema.index({ childId: 1, isRead: 1, createdAt: -1 });

const Alert = mongoose.model("Alert", alertSchema);

export default Alert;
