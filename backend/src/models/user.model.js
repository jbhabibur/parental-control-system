import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      unique: true,
    },

    passwordHash: {
      type: String,
      required: function () {
        return this.role === "PARENT";
      },
      select: false,
    },

    role: {
      type: String,
      enum: ["PARENT", "CHILD"],
      required: true,
    },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    mfaEnabled: {
      type: Boolean,
      default: false,
    },

    mfaSecretEncrypted: {
      type: String,
      select: false,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.index({ parentId: 1, role: 1 });

userSchema.pre("validate", function () {
  if (this.role === "CHILD" && !this.parentId) {
    this.invalidate("parentId", "Child must belong to a parent");
  }

  if (this.role === "PARENT" && this.parentId) {
    this.invalidate("parentId", "Parent cannot have a parent");
  }

  if (this.role === "PARENT" && !this.email) {
    this.invalidate("email", "Parent email is required");
  }
});

const User = mongoose.model("User", userSchema);

export default User;
