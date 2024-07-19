import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import customParser from "socket.io-msgpack-parser"; // will use protobuff later
import { bodyParserMiddleWare, cookieParserMiddleWare, corsMiddleWare } from "./middlewares/appMiddleware.js";
import { authRouter, chatRouter, userRouter } from "./routes/index.js";
import { connectDatabase } from "./config/database.js";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware.js";
import { authenticateConnectionMiddleware } from "./middlewares/socketMiddleware.js";
import {
  addToUserIdSocketMap,
  generateChatId,
  generateTimeUUID,
  getCurrentUTCTimestamp,
  parseCookies,
  refetchQueryEventEmit,
  removeFromUserIdSocketMap,
  UserIdToSocketMap,
  verifyJWT,
} from "./utils/index.js";
import { getSessions } from "./models/socket.js";
import { sendMessageController } from "./controllers/messageController.js";
import { getMessageListing } from "./models/messages.js";

const joinedRooms = {};

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
    console.log("Client connected", socket.id);
    const user_id = socket.handshake.auth.user_id ?? "";
    const cookies = socket.handshake.headers.cookie;
    const parsedCookies = parseCookies({ cookies });
    const session_id = parsedCookies?.session_id || "";

    const sessions = await getSessions({ session_id, user_id });
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
    addToUserIdSocketMap({ socket, user_id });

    socket.on("send-message", async (data) => {
      try {
        const res = await sendMessageController({ message: data?.message, recipients: data.recipients, user_id });
        if (!res) {
          throw new Error("Unable to send message");
        }
        refetchQueryEventEmit({ socket, queryKey: ["messageListing"], type: "socket" });
      } catch (err) {
        socket.emit("error", err?.message);
      }
    });

    socket.on("message-listing", async (data, callback = () => null) => {
      const messageListing = await getMessageListing({ user_id, recipientId: data?.recipientId });
      callback({ data: messageListing });
    });

    // socket.on("active-chat", async (data) => {
    //   if (joinedRooms && joinedRooms[user_id] && joinedRooms[user_id] instanceof Array) {
    //     joinedRooms[user_id].forEach((room) => {
    //       socket.leave(room, (err) => {
    //         if (err) {
    //           console.error(`Error leaving room ${room}:`, err);
    //         } else {
    //           console.log(`Left room: ${room}`);
    //         }
    //       });
    //     });
    //   }

    //   const recipientId = data?.recipientId;
    //   const chatId = generateChatId({ senderId: user_id, receiverId: recipientId });
    //   const clearResp = await clearUnreadCount({ user_id, friend_id: recipientId });
    //   if (!(!clearResp || clearResp?.info?.queriedHost === null)) {
    //     socket.emit("chat-update", {
    //       type: "msg-read",
    //       data: {
    //         chatId,
    //       },
    //     });
    //   }

    //   if (!joinedRooms[user_id]) {
    //     joinedRooms[user_id] = [];
    //   }
    //   // Add the socket.id to the array for this user_id
    //   joinedRooms[user_id].push(chatId);
    //   socket.join(chatId);
    // });

    socket.on("disconnect", () => {
      removeFromUserIdSocketMap({ socket, user_id });
      // if (joinedRooms && joinedRooms[user_id] && joinedRooms[user_id] instanceof Array) {
      //   joinedRooms[user_id].forEach((room) => {
      //     socket.leave(room, (err) => {
      //       if (err) {
      //         console.error(`Error leaving room ${room}:`, err);
      //       } else {
      //         console.log(`Left room: ${room}`);
      //       }
      //     });
      //   });
      // }
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
