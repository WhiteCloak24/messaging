import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import customParser from "socket.io-msgpack-parser";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import { bodyParserMiddleWare, corsMiddleWare } from "./middlewares.js";

async function startApolloServer() {
  const app = express();
  const apolloServer = new ApolloServer({});
  bodyParserMiddleWare(app);
  corsMiddleWare(app);

  await apolloServer.start();
  app.use("/graphql", expressMiddleware(apolloServer));
  app.listen(4000, () => {
    console.log("Server is running on PORT 4000");
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

startApolloServer();
