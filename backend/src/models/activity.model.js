import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
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

    eventType: {
      type: String,
      enum: [
        "APP_FOREGROUND",
        "APP_INSTALLED",
        "APP_LAUNCH",
        "APP_BLOCKED",
        "LOCATION",
        "DEVICE_STATUS",
        "INTEGRITY_CHECK",
        "BROWSER_VISIT",
        "BROWSER_BLOCKED",
        "PERMISSION_REQUEST",
      ],
      required: true,
    },

    appIdentifier: {
      type: String,
      default: null,
    },

    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    location: {
      latitude: Number,
      longitude: Number,
    },

    occurredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

activitySchema.index({ childId: 1, occurredAt: -1 });
activitySchema.index({ deviceId: 1, eventType: 1, occurredAt: -1 });

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
