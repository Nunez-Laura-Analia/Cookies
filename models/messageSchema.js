import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    author: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      surname: { type: String, required: true },
      age: { type: Number, required: true },
      alias: { type: String, required: true },
      avatar: { type: String, required: true },
    },
    timestamp: { type: String, required: true },
    text: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("Messages", MessageSchema);
