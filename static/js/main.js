const socket = io();

// let nickname, user_id, roomName, post_id;
// const url = window.location.href;
// const params = new URL(url).pathname.split("/");
// post_id = params[params.length - 1];

// fetch(`/api/chat/${post_id}`, { credentials: "include" })
//   .then((response) => response.text())
//   .then((data2) => {
//     const regex = /<script>window\.resData = (\{.*?\});<\/script>/;
//     const matches = data2.match(regex);

//     if (matches && matches.length >= 2) {
//       const resData = JSON.parse(matches[1]);
//       const { nickname, roomName } = resData;
//       socketSetup(nickname, roomName);
//     } else {
//       console.error("데이터를 찾을 수 없습니다");
//     }
//   })
//   .catch((error) => {
//     console.error("오류 발생:", error);
//   });

// function socketSetup(nickname, roomName) {
//   socket.on("connect", () => {
//     console.log(roomName);
//     let name = nickname || "익명";
//     // prompt("닉네임을 적어주세요", "") || "익명";
//     let room = roomName || "기본방";

//     socket.emit("newUser", name, room);
//   });

//   socket.on("update", (data) => {
//     console.log(`${data.name}:${data.message}`);
//     let chat = document.getElementById("chat");
//     let message = document.createElement("div");
//     let node = document.createTextNode(`${data.name}: ${data.message}`);
//     let className = "";

//     switch (data.type) {
//       case "message":
//         className = "other";
//         break;

//       case "connect":
//         className = "connect";
//         break;

//       case "disconnect":
//         className = "disconnect";
//         break;
//     }

//     message.classList.add(className);
//     message.appendChild(node);
//     chat.appendChild(message);
//   });
// }

// socket.on("connect", () => {
//   console.log(roomName);
//   let name = nickname || "익명";
//   // prompt("닉네임을 적어주세요", "") || "익명";
//   let room = roomName || "기본방";

//   socket.emit("newUser", name, room);
// });

socket.on("connect", () => {
  let name = prompt("닉네임을 적어주세요", "") || "익명";
  let room = prompt("방번호를 적어주세요", "") || "기본방";

  socket.emit("newUser", name, room);
});

socket.on("update", (data) => {
  console.log(`${data.name}:${data.message}`);
  let chat = document.getElementById("chat");
  let message = document.createElement("span");
  let node = document.createTextNode(`${data.name}: ${data.message}`);
  let className = "";

  switch (data.type) {
    case "message":
      className = "other";
      break;

    case "connect":
      className = "connect";
      break;

    case "disconnect":
      className = "disconnect";
      break;
  }

  message.classList.add(className);
  message.appendChild(node);
  chat.appendChild(message);
});

function handleKeyDown(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    send();
  }
}

function send() {
  let message = document.getElementById("test").value;
  document.getElementById("test").value = "";

  let chat = document.getElementById("chat");
  let msg = document.createElement("span");
  let node = document.createTextNode(message);

  msg.classList.add("me");
  msg.appendChild(node);
  chat.appendChild(msg);

  socket.emit("message", { type: "message", message: message, read: false });
}

// socket.on("message read", (message) => {
//   console.log(`${message.id}가 읽음으로 표시되었습니다.`);

//   let messageElement = document.getElementById(`message-${message.id}`);
//   if (messageElement) {
//     messageElement.classList.add("read");
//   }
// });

// function markMessageAsRead(messageId) {
//   socket.emit("message read", messageId);
// }
