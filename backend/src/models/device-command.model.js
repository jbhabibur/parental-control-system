import mongoose from "mongoose";

const deviceCommandSchema = new mongoose.Schema(
  {
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },

    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    command: {
      type: String,
      enum: ["LOCK", "PAUSE", "UNLOCK", "RESUME"],
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "DELIVERED", "EXECUTED", "FAILED", "EXPIRED"],
      default: "PENDING",
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },

    executedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    failureReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

deviceCommandSchema.index({ deviceId: 1, status: 1 });

const DeviceCommand = mongoose.model("DeviceCommand", deviceCommandSchema);

export default DeviceCommand;
