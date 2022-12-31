import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    required: [true, "Please add a name"],
  },
  type: {
    type: String,
  },
  members: [
    {
      type: String,
      ref: "User",
    },
  ],
});

export const Room = mongoose.model("Room", roomSchema);
