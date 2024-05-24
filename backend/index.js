import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import customParser from "socket.io-msgpack-parser";
import bodyParser from "body-parser";

const app = express();
const httpServer = createServer(app);
app.use(bodyParser);

const io = new Server(httpServer, {
  cors: { origin: "*" },
  parser: customParser,
});

io.on("connection", async (socket) => {});

httpServer.listen(4000, "localhost", () => {
  console.log("Socket Server is listening to", 4000);
});

app.post("/login", (req, res) => {
  const { email } = req.body;
  console.log(email);
});

app.listen(6000, () => {
  console.log(`API Server is running on port 6000`);
});
