import cassandra from "cassandra-driver";

export let client;

export async function connectDatabase() {
  client = new cassandra.Client({
    contactPoints: ['127.0.0.1'],  // Replace with your Cassandra node IPs
    localDataCenter: 'datacenter1' // Replace with your data center name
  });
  console.time("Connection with db created in");
  await client.connect();
  await client.execute("USE admin");
  console.timeEnd("Connection with db created in");
}
// export async function connectDatabase() {
//   client = new cassandra.Client({
//     cloud: {
//       secureConnectBundle: "services/secure-connect-messaging.zip",
//     },
//     credentials: {
//       username: process.env["CLIENT_ID"],
//       password: process.env["CLIENT_SECRET"],
//     },
//     keyspace: "admin",
//   });
//   console.time("Connection with db created in");
//   await client.connect();
//   await client.execute("USE admin");
//   console.timeEnd("Connection with db created in");
// }
