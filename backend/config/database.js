
import cassandra from "cassandra-driver";

export let client;

export async function connectDatabase() {
  client = new cassandra.Client({
    cloud: {
      secureConnectBundle: "services/secure-connect-messaging.zip",
    },
    credentials: {
      username: process.env["CLIENT_ID"],
      password: process.env["CLIENT_SECRET"],
    },
  });
  console.time("Connection with db created in");
  await client.connect();
  await client.execute("USE admin");
  console.timeEnd("Connection with db created in");
}

