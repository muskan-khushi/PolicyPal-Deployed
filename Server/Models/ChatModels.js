import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "bot"],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;
