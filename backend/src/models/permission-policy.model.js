import mongoose from "mongoose";

const permissionPolicySchema = new mongoose.Schema(
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

    resource: {
      type: String,
      enum: [
        "CAMERA",
        "MICROPHONE",
        "LOCATION",
        "MOBILE_DATA",
        "STORAGE",
        "OTHER",
      ],
      required: true,
    },

    isAllowed: {
      type: Boolean,
      default: false,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

permissionPolicySchema.index(
  { childId: 1, deviceId: 1, resource: 1 },
  { unique: true },
);

const PermissionPolicy = mongoose.model(
  "PermissionPolicy",
  permissionPolicySchema,
);

export default PermissionPolicy;
