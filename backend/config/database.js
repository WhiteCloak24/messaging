import cassandra from "cassandra-driver";

export let client;

export async function connectDatabase() {
  client = new cassandra.Client({
    // contactPoints: ["34.93.23.0"], // Replace with your Cassandra node IPs
    contactPoints: ["127.0.0.1"], // Replace with your Cassandra node IPs
    localDataCenter: "datacenter1", // Replace with your data center name
    keyspace: "admin",
  });
  console.time("Connection with db created in");
  await client.connect();
  // await client.execute("USE admin");
  console.timeEnd("Connection with db created in");
}

// https://cassandra.apache.org/doc/latest/cassandra/getting-started/
