import mongoose from "mongoose";

const permissionRequestSchema = new mongoose.Schema(
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

    requestType: {
      type: String,
      enum: ["HARDWARE_PERMISSION", "APPLICATION_ACCESS", "DOMAIN_ACCESS"],
      required: true,
    },

    resource: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "DENIED", "EXPIRED"],
      default: "PENDING",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

permissionRequestSchema.index({ childId: 1, status: 1 });
permissionRequestSchema.index({ deviceId: 1, createdAt: -1 });

const PermissionRequest = mongoose.model(
  "PermissionRequest",
  permissionRequestSchema,
);

export default PermissionRequest;
