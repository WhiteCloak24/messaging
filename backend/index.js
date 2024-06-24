import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import customParser from "socket.io-msgpack-parser"; // will use protobuff later
import { bodyParserMiddleWare, cookieParserMiddleWare, corsMiddleWare } from "./middlewares/appMiddleware.js";
import { authRouter, chatRouter, userRouter } from "./routes/index.js";
import { connectDatabase } from "./config/database.js";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware.js";
import { authenticateConnectionMiddleware } from "./middlewares/socketMiddleware.js";
import { parseCookies, verifyJWT } from "./utils/index.js";
import { getSessions } from "./models/socket.js";
import { checkFriend, createFriend } from "./models/chat.js";

const ioSessionMap = {};

async function startApiServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" },
    // parser: customParser,
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

  app.use("/user", verifyJWT, userRouter);
  app.use("/chat", verifyJWT, chatRouter);

  app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Could not find resource" });
  });

  io.on("connection", async (socket) => {
    const user_id = socket.handshake.auth.user_id ?? "";
    const cookies = socket.handshake.headers.cookie;
    const parsedCookies = parseCookies({ cookies });
    const session_id = parsedCookies?.session_id || "";
    const sessions = await getSessions({ session_id, user_id });
    console.log("Client connected", socket.id);
    if (sessions?.length > 0) {
      const session = sessions[0];
      const jwt_token = session?.jwt_token;
      socket.emit("jwt-token", {
        jwt_token,
      });
    } else {
      socket.emit("user-logout", {
        reason: "Session not found",
      });
    }

    if (!ioSessionMap[user_id]) {
      ioSessionMap[user_id] = [];
    }
    // Add the socket.id to the array for this user_id
    ioSessionMap[user_id].push(socket.id);

    socket.on("send-message", async (data, ...rest) => {
      const recipient_id = data?.recipients?.[0];
      const res = await checkFriend({ user_id, friend_id: recipient_id });
      if (res?.length > 0) {
      } else {
        createFriend({ friend_id: recipient_id, user_id, last_message: data?.message });
      }
      // console.log(res);
    });

    socket.on("disconnect", () => {
      if (ioSessionMap[user_id]) {
        ioSessionMap[user_id] = ioSessionMap[user_id].filter((id) => id !== socket.id);
        if (ioSessionMap[user_id].length === 0) {
          delete ioSessionMap[user_id]; // Remove the user_id entry if no more sockets
        }
      }
      console.log("Client disconnected");
    });
  });
  errorHandlerMiddleware(app);

  httpServer.listen(4000, async () => {
    console.log("Server is running on PORT 4000");
    await connectDatabase();
  });
}

await startApiServer();
