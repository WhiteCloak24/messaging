import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import customParser from "socket.io-msgpack-parser";
import { bodyParserMiddleWare, cookieParserMiddleWare, corsMiddleWare } from "./middlewares/appMiddleware.js";
import { authRouter } from "./routes/index.js";
import { connectDatabase } from "./config/database.js";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware.js";
import { authenticateConnectionMiddleware } from "./middlewares/socketMiddleware.js";
import { parseCookies } from "./utils/index.js";
import { getSessions } from "./models/socket.js";

async function startApiServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" },
    parser: customParser,
  });

  bodyParserMiddleWare(app);
  corsMiddleWare(app);
  cookieParserMiddleWare(app);

  authenticateConnectionMiddleware(io);

  app.set("trust proxy", true);
  app.get("/", (req, res) => {
    res.send("Dashboard");
  });
  app.use("/auth", authRouter);

  io.on("connection", async (socket) => {
    const user_id = socket.handshake.auth.user_id ?? "";
    const cookies = socket.handshake.headers.cookie;
    const parsedCookies = parseCookies({ cookies });
    const session_id = parsedCookies?.session_id || "";
    const sessions = await getSessions({ session_id, user_id });
    if (sessions?.length > 0) {
      console.log(sessions);
    } else {
      // logout the user
    }

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
  errorHandlerMiddleware(app);

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
