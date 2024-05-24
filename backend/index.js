import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import customParser from "socket.io-msgpack-parser";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*" },
  parser: customParser,
});

io.on("connection", async (socket) => {
  console.log("Someone connected", socket.id);
  socket.on("heeey", (data) => {
    console.log(data);
  });
});

httpServer.listen(4000, "localhost", () => {
  console.log("Server is listening to", 4000);
});
