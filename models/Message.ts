import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: String,
    contentType: String,
    from: Object,
    isActive: Boolean,
    time: String,
    date: String,
    to: String,
  },
  {
    timestamps: true,
    minimize: false,
  }
);

export const Message = mongoose.model("Message ", messageSchema);
