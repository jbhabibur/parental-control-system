import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    deviceIdentifierHash: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },

    deviceName: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    platform: {
      type: String,
      enum: ["ANDROID", "IOS"],
      required: true,
    },

    status: {
      type: String,
      enum: ["ONLINE", "OFFLINE"],
      default: "OFFLINE",
    },

    integrityStatus: {
      type: String,
      enum: ["UNKNOWN", "HEALTHY", "ROOTED", "JAILBROKEN", "TAMPERED"],
      default: "UNKNOWN",
    },

    currentForegroundApp: {
      type: String,
      default: null,
    },

    lastKnownLocation: {
      latitude: Number,
      longitude: Number,
      recordedAt: Date,
    },

    pushToken: {
      type: String,
      default: null,
      select: false,
    },

    certificateFingerprint: {
      type: String,
      default: null,
      select: false,
    },

    certificateRevoked: {
      type: Boolean,
      default: false,
    },

    lastSeenAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

deviceSchema.index({ userId: 1, status: 1 });

const Device = mongoose.model("Device", deviceSchema);

export default Device;
