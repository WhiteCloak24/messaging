import cassandra from "cassandra-driver";

export let client;

export async function connectDatabase() {
  const authProvider = new cassandra.auth.PlainTextAuthProvider("token", process.env["APPLICATION_TOKEN"]);
  client = new cassandra.Client({
    cloud: {
      secureConnectBundle: "resources/secure-connect-messaging.zip",
    },
    authProvider,
  });
  console.time("Connection with db created in");
  await client.connect();
  console.timeEnd("Connection with db created in");
}
