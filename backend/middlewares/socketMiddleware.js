
export function authenticateTokenMiddleware(io) {
  io.use((socket, next) => {
    const user_id = socket.handshake.auth.user_id;
    const session_id = socket.handshake.auth.session_id;
    if (!false) {
      next();
    } else {
      const err = new Error("Authentication error");
      err.data = { content: "Invalid token" }; // Optional details
      socket.disconnect();
    }
  });
}
