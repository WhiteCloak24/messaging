import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", async (socket) => {
  console.log('Someone connected',socket.id);
});

httpServer.listen(4000, "localhost", () => {
  console.log("Server is listening to", 4000);
});
