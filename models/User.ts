import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      lowercase: true,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      index: true,
      // validate: [validator.isEmail, "invalid email"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    image: {
      type: String,
    },
    newMessages: {
      type: Schema.Types.Mixed,
      _id: false,
      default: {},
    },
    status: {
      type: String,
      default: "online",
    },
    token: {
      type: String,
      required: false,
    },
    refreshToken: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

// userSchema.pre("save",async (next) => {
//   const user: any = this;
//   if (!user.isModified("password")) return null;

//   const salt =await bcrypt.genSalt();
//   const hashedPassword =await bcrypt.hash(user.password, salt);

//   user.password = hashedPassword;
//   next();
// });

userSchema.methods.toJson = () => {
  const user: any = this;
  if (user) {
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  }
};

userSchema.statics.findByCredentials = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passMatch = await bcrypt.compare(password, user.password);

  if (!passMatch) {
    throw new Error("Invalid email or password");
  }

  return user;
};

export const User = mongoose.model("User", userSchema);
