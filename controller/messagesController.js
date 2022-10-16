import mongoose from "mongoose";
import Messages from "../models/messageSchema.js";

class MessagesController {
  constructor() {
    try {
      mongoose.connect(
        ""
      ),
        { useNewUrlParser: true };
    } catch (e) {
      console.log(e);
    }
  }

  async save(msg) {
    try {
      msg.timestamp = new Date();
      await Messages.create(msg);
      return msg;
    } catch (e) {
      console.log(e);
    }
  }

  async getAll() {
    try {
      msg = await Messages.find({});
      return msg;
    } catch (e) {
      console.log(e);
    }
  }
}

export default MessagesController;
