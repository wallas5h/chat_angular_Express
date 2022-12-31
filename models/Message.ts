import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  content: String,
  from: Object,
  sockedId: String,
  time: String,
  date: String,
  to: String,
});

export const Message = mongoose.model("Message ", messageSchema);
