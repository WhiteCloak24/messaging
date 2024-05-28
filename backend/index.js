import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import customParser from "socket.io-msgpack-parser";
import { bodyParserMiddleWare, corsMiddleWare } from "./middlewares.js";
import { connectDatabase } from "./resources/database.js";
import { filterUserByEmailQuery } from "./queries/AuthQueries.js";

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
  app.post("/login", async (req, res) => {
    const { email = "" } = req.body;
    const queryResult = await filterUserByEmailQuery({ email: email });
    if (queryResult?.length > 0) {
      const userData = queryResult?.[0];
      res.json(userData);
    } else {
      res.send("User not found");
    }
  });
  app.listen(4000, async () => {
    console.log("Server is running on PORT 4000");
    await connectDatabase();
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
