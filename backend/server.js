const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;

let queue = [];
let current = null;

app.use(express.static("frontend"));

io.on("connection", (socket) => {

  socket.emit("update", { queue, current });

  socket.on("add", (data) => {
    queue.push(data);
    io.emit("update", { queue, current });
  });

  socket.on("remove", (id) => {
    queue = queue.filter(x => x.id !== id);
    io.emit("update", { queue, current });
  });

  socket.on("skip", () => {
    current = queue.shift() || null;
    io.emit("update", { queue, current });
  });

});

server.listen(PORT);
