let io;

function init(server) {
  const socketIo = require("socket.io");
  io = socketIo(server);

  io.on("connection", () => {
    console.log("Client connected");
  });
}

function broadcast(data) {
  if (io) io.emit("transaction", data);
}

module.exports = { init, broadcast };