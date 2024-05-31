import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import customParser from "socket.io-msgpack-parser";
import { bodyParserMiddleWare, cookieParserMiddleWare, corsMiddleWare } from "./middlewares.js";
import { connectDatabase } from "./resources/database.js";
import { authRouter } from "./router/index.js";
import { parseCookies } from "./commons/index.js";

async function startApiServer() {
  const app = express();
  bodyParserMiddleWare(app);
  corsMiddleWare(app);
  cookieParserMiddleWare(app);

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" },
    parser: customParser,
  });

  app.set("trust proxy", true);
  app.get("/", (req, res) => {
    res.send("Dashboard");
  });
  app.use("/auth", authRouter);

  io.on("connection", (socket) => {
    console.log("New client connected", socket?.id);
    const user_id = socket.handshake.auth.token ?? "";
    const cookies = socket.handshake.headers.cookie;
    const parsedCookies = parseCookies({ cookies });
    const session_id = parsedCookies?.session_id || "";
    if (user_id && session_id) {
      console.log({ user_id, session_id });
    }
    // Handle client disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  httpServer.listen(4000, async () => {
    console.log("Server is running on PORT 4000");
    await connectDatabase();
  });
}

// async function startSocketServer() {
//   const app = express();
//   const httpServer = createServer(app);

//   const io = new Server(httpServer, {
//     cors: { origin: "*" },
//     parser: customParser,
//   });

//   io.listen(5000, async () => {
//     console.log("Socket Server is running on PORT 5000");
//     io.on("connection", (socket) => {
//       console.log("Socket connected", socket?.id);
//     });
//   });
// }

// await startSocketServer();
await startApiServer();
