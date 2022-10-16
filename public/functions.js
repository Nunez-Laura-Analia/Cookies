export const denormalize = (msg) => {
    const author = new normalizr.schema.Entity("authors");
    const chats = new normalizr.schema.Entity("chats", { chats: [messages] });
    const messages = new normalizr.schema.Entity("messages", {
      author: author,
    });
    const denormalizedMessages = normalizr.denormalize(
      msg.result,
      chats,
      msg.entities
    );
    return denormalizedMessages;
  };