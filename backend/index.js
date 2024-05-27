import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import customParser from "socket.io-msgpack-parser";
import { bodyParserMiddleWare, corsMiddleWare } from "./middlewares.js";
import cassandra from "cassandra-driver";

const cloud = { secureConnectBundle: process.env["DATACENTER_ID"] };
const authProvider = new cassandra.auth.PlainTextAuthProvider("token", process.env["APPLICATION_TOKEN"]);
const client = new cassandra.Client({ cloud, authProvider });

async function connectDatabase() {
  await client.connect();
}

async function startApolloServer() {
  const app = express();
  // const apolloServer = new ApolloServer({});
  bodyParserMiddleWare(app);
  corsMiddleWare(app);

  // await apolloServer.start();
  // app.use("/graphql", expressMiddleware(apolloServer));
  app.get("/", (req, res) => {
    connectDatabase();
    res.send("Hello");
  });
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
