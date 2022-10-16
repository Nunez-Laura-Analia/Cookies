import MessagesController from "../../controller/messagesController.js";
import { normalizeMessages } from "../normalizr/normalizeMessages.js";
const messagesController = new MessagesController();

export async function socketController(io) {
  io.on("connection", async (socket) => {
    
    let messages = await messagesController.getAll();
    io.sockets.emit("messages", normalizeMessages(messages));

    socket.on("new-message", async (msg) => {
      let parsedMsg = JSON.parse(msg);
      await messagesController.save(parsedMsg);
      let allMessages = await messagesController.getAll();
      io.sockets.emit("messages", normalizeMessages(allMessages));
    });
  });
};