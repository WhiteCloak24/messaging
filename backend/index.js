import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import customParser from "socket.io-msgpack-parser";
import { bodyParserMiddleWare, cookieParserMiddleWare, corsMiddleWare } from "./middlewares.js";
import { connectDatabase } from "./resources/database.js";
import { authRouter } from "./router/index.js";

async function startApiServer() {
  const app = express();
  bodyParserMiddleWare(app);
  corsMiddleWare(app);
  cookieParserMiddleWare(app);

  app.get("/", (req, res) => {
    res.send("Dashboard");
  });

  app.use("/auth", authRouter);
  app.listen(4000, async () => {
    console.log("Server is running on PORT 4000");
    await connectDatabase();
  });
}

async function startSocketServer() {
  const app = express();
  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: { origin: "*" },
    parser: customParser,
  });
}

startApiServer();
