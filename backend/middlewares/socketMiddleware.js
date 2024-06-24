import { parseCookies } from "../utils/index.js";

export const authenticateConnectionMiddleware = (io) => {
  io.use(async (socket, next) => {
    const user_id = socket.handshake.auth.user_id;
    const cookies = socket.handshake.headers.cookie;
    const parsedCookies = parseCookies({ cookies });
    const session_id = parsedCookies?.session_id || "";
    if (user_id && session_id) {
      next();
    } else {
      const err = new Error("Authentication error");
      err.data = { content: "Invalid token" }; // Optional details
      socket.disconnect();
    }
  });
};
