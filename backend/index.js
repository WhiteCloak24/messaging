import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import customParser from "socket.io-msgpack-parser";
import { bodyParserMiddleWare, corsMiddleWare } from "./middlewares.js";
import cassandra from "cassandra-driver";

async function connectDatabase() {
  const authProvider = new cassandra.auth.PlainTextAuthProvider("token", process.env["APPLICATION_TOKEN"]);
  const client = new cassandra.Client({
    cloud: {
      secureConnectBundle: "secure-connect-messaging.zip",
    },
    authProvider,
  });
  console.time("connection");
  await client.connect();
  console.timeEnd("connection");
  const keyspace = "test";

  await client.execute(`
  CREATE TABLE ${keyspace}.users (
    firstname text,
    lastname text,
    email text,
    "favorite color" text,
    PRIMARY KEY (firstname, lastname)
  )
    WITH CLUSTERING ORDER BY (lastname ASC);
`);
}

async function startApolloServer() {
  const app = express();
  // const apolloServer = new ApolloServer({});
  bodyParserMiddleWare(app);
  corsMiddleWare(app);

  // await apolloServer.start();
  // app.use("/graphql", expressMiddleware(apolloServer));
  app.get("/", (req, res) => {
    res.send("Hello");
  });
  app.listen(4000, () => {
    console.log("Server is running on PORT 4000");

    connectDatabase();
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
