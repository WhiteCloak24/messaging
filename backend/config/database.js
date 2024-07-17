import cassandra from "cassandra-driver";

export let client;

export async function connectDatabase() {
  client = new cassandra.Client({
    contactPoints: [process.env.CASSANDRA_DB_IP], // Replace with your Cassandra node IPs
    // contactPoints: [process.env.CASSANDRA_DB_IP], // Replace with your Cassandra node IPs
    localDataCenter: "datacenter1", // Replace with your data center name
    // keyspace: "admin",
  });
  console.time("Connection with db created in");
  await client.connect();
  // await client.execute("USE admin");
  console.timeEnd("Connection with db created in");
}

// https://cassandra.apache.org/doc/latest/cassandra/getting-started/
