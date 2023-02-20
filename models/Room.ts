import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    required: [true, "Please add a name"],
  },
  createdBy: {
    id: String,
    name: String,
  },
  type: {
    type: String,
  },
  isActive: {
    type: Boolean,
  },
  dislikeMembers: [
    {
      type: String,
      ref: "User",
    },
  ],
  members: [
    {
      id: String,
      name: String,
    },
  ],
});

export const Room = mongoose.model("Room", roomSchema);
