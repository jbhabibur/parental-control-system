import mongoose from "mongoose";

const screenTimePolicySchema = new mongoose.Schema(
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

    dailyLimitMinutes: {
      type: Number,
      required: true,
      min: 0,
    },

    bedtime: {
      start: {
        type: String,
        default: null,
      },

      end: {
        type: String,
        default: null,
      },
    },

    timezone: {
      type: String,
      required: true,
      default: "Asia/Dhaka",
    },

    perAppLimits: [
      {
        appIdentifier: {
          type: String,
          required: true,
        },

        limitMinutes: {
          type: Number,
          required: true,
          min: 0,
        },
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

screenTimePolicySchema.index({ childId: 1, deviceId: 1 }, { unique: true });

const ScreenTimePolicy = mongoose.model(
  "ScreenTimePolicy",
  screenTimePolicySchema,
);

export default ScreenTimePolicy;
