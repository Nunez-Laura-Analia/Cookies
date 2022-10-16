import { normalize, schema } from "normalizr";

const debuggChat = (msg) => {
  const array = { id: "messages", chats: [] };
  array.chats = msg.map((item) => {
    return {
      id: item._id,
      author: item.author,
      text: item.text,
      timestamp: item.timestamp,
    };
  });
  return array;
};

export const normalizeMessages = (msg) => {
  const debuggedChat = debuggChat(msg);
  const author = new schema.Entity("authors");
  const messages = new schema.Entity("messages", {
    author: author,
  });
  const chats = new schema.Entity("chats", { chats: [messages] });
  const normalizedPosts = normalize(debuggedChat, chats);
  return normalizedPosts;
};