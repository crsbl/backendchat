const httpServer = require("http").createServer();

let messages = [
  {
    colorCode: "rgb(71, 75, 94)",
    name: "Admin",
    message: "hola",
  },
];
let countUsers = 0;


let server = httpServer.listen(process.env.PORT || 3001, () => {
  console.log("...");
});
let io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", function (socket) {
  countUsers =io.sockets.sockets.size
  io.sockets.emit('updateNumConnections', countUsers);
  socket.emit("messagesUsers", messages);

  socket.on("sendMessages", (text) => {
    messages.push({
      name: text.name,
      message: text.message,
      colorCode: text.colorCode,
    });
    console.log(text);
    io.emit("messagesUsers", messages);

    if (messages.length > 200) {
      messages = [
        {
          colorCode: 0,
          name: "Admin",
          message: "chat reset",
        },
      ];
    }

    /*   let busqueda = users.filter((list) => list.id == text.id);
    if (busqueda == false) {
      users.push({ id: text?.id });
      console.log(users);
      io.emit("listUsers", users);
    } */
  });

  socket.on("disconnect", (text) => {
    countUsers =io.sockets.sockets.size
    io.sockets.emit('updateNumConnections', countUsers);
  });
});
