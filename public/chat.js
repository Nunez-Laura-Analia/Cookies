const socket = io();
import { denormalize } from "./functions.js";

const button = document.getElementById("submitMessage");
button.addEventListener("click", (e) => {
  const message = {
    author: {
      id: document.getElementById("email").value,
      nombre: document.getElementById("name").value,
      apellido: document.getElementById("surename").value,
      edad: document.getElementById("age").value,
      alias: document.getElementById("alias").value,
      avatar: document.getElementById("avatar").value,
    },
    text: document.getElementById("boxMsg").value,
  };
  socket.emit("new-message", JSON.stringify(message));
  document.getElementById("boxMsg").value = "";
});

socket.on("messages", (data) => {
  let denormalizedChats = denormalize(data);
  let compression =
    (JSON.stringify(denormalizedChats).length / JSON.stringify(data).length) *
    100;
  document.getElementById(
    "div-compres"
  ).innerText = `The compression percentage is %${compression
    .toString()
    .slice(0, 5)}`;

  const add = denormalizedChats.chats
    .map((chat) => {
      let time = new Date(chat.timestamp);
      let formatedTime = time
        .toISOString()
        .replace(/([^T]+)T([^\.]+).*/g, "$1 $2");
      return `
  <p>
  <span>${chat.author.id}</span>
  <span">[${formatedTime}]: </span>
  <span>${chat.text}</span>
  <img class='avatar' src='${chat.author.avatar}'></img>
  </p>
  `;
    })
    .join(" ");

  document.getElementById("div-chats").innerHTML = add;
});

document.getElementById("logout").classList.remove("d-none");