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
  generateUuid,
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
import { S3Service } from "./services/aws-service/index.js";

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
        console.log(data);
        // const { attachments = [] } = data;

        // if (attachments.length > 0) {
          // const aws = new S3Service();
          // const chatId = generateChatId({ receiverId: user_id, senderId: data.recipients?.[0] });
          // console.log(chatId);
          // aws.createFolderIfNotExist(`${chatId}/`);
          // for (let index = 0; index < attachments.length; index++) {
          //   const fileServerName = `${generateUuid()}.${mimeType?.split("/")[1]}`;
          //   const fileBuffer = attachments[index].file;
          //   const mimeType = attachments[index].mimeType;
          //   const buffer = Buffer.from(fileBuffer);
          //   console.log(fileServerName);
          //   console.timeEnd('Uploading took')
          //   const response = await aws.putFile({ file: buffer, type: mimeType, filename: `${chatId}/${fileServerName}` });
          //   console.timeEnd('Uploading took')
          // }
        // }
        // const res = await sendMessageController({ message: data?.message, recipients: data.recipients, user_id });
        // if (!res) {
        //   throw new Error("Unable to send message");
        // }
        // refetchQueryEventEmit({ socket, queryKey: "messageListing", type: "socket" });
        // refetchQueryEventEmit({ socket, queryKey: ["chatListing"], type: "api" });
      } catch (err) {
        console.log(err?.message);
        socket.emit("error", err?.message);
      }
    });

    socket.on("message-listing", async (data, callback = () => null) => {
      const messageListing = await getMessageListing({ user_id, recipientId: data?.recipientId });
      callback({ data: messageListing });
    });

    socket.on("disconnect", () => {
      removeFromUserIdSocketMap({ socket, user_id });

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
