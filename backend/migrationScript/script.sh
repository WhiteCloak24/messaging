#!/bin/bash

# Variables
LOCAL_CASSANDRA_HOST="127.0.0.1"
LOCAL_CASSANDRA_PORT="9042"
GCP_VM_IP="34.93.0.213"  # Replace with your Google Cloud VM IP
DOCKER_CONTAINER_NAME="cass_cluster"  # Replace with your container name
DOCKER_CASSANDRA_PORT="9042"
ADMIN_KEYSPACE="admin"  # Replace with your keyspace name
CQLSH_PATH="C:/apache-cassandra-3.11.6/bin/cqlsh"  # Use forward slashes

# Step 1: Get the list of tables in the keyspace
echo "Fetching list of tables in keyspace $ADMIN_KEYSPACE..."
tables=$(echo "DESCRIBE TABLES;" | $CQLSH_PATH $LOCAL_CASSANDRA_HOST $LOCAL_CASSANDRA_PORT -e "USE $ADMIN_KEYSPACE; DESCRIBE TABLES;" | grep -v '^$')

# Step 2: Loop through each table and export schema and data
for table in $tables; do
    SCHEMA_FILE="${table}_schema.cql"
    DUMP_FILE="${table}.cql"

    echo "Exporting schema for table $table..."
    $CQLSH_PATH $LOCAL_CASSANDRA_HOST $LOCAL_CASSANDRA_PORT -e "USE $ADMIN_KEYSPACE; DESCRIBE TABLE $table;" | grep -v -e 'dclocal_read_repair_chance' -e 'read_repair_chance'  > $SCHEMA_FILE

    echo "Exporting data for table $table..."
    $CQLSH_PATH $LOCAL_CASSANDRA_HOST $LOCAL_CASSANDRA_PORT -e "USE $ADMIN_KEYSPACE; COPY $table TO '$DUMP_FILE';"

    echo "Transferring schema and data for table $table to Google Cloud VM..."
    scp $SCHEMA_FILE $DUMP_FILE yashjain200024@$GCP_VM_IP:~/  # Replace your_username with your actual username

    echo "Copying schema and data for table $table to Docker container..."
    ssh yashjain200024@$GCP_VM_IP "sudo docker cp ~/$SCHEMA_FILE $DOCKER_CONTAINER_NAME:/$SCHEMA_FILE"
    ssh yashjain200024@$GCP_VM_IP "sudo docker cp ~/$DUMP_FILE $DOCKER_CONTAINER_NAME:/$DUMP_FILE"

    echo "Importing schema and data for table $table into Docker Cassandra..."
    ssh yashjain200024@$GCP_VM_IP "
        sudo docker exec $DOCKER_CONTAINER_NAME cqlsh -e \"SOURCE '$SCHEMA_FILE';\"
    "
    ssh yashjain200024@$GCP_VM_IP "
        sudo docker exec $DOCKER_CONTAINER_NAME cqlsh $DOCKER_CASSANDRA_PORT -e \"COPY $ADMIN_KEYSPACE.$table FROM '$DUMP_FILE';\"
    "
    ssh yashjain200024@$GCP_VM_IP "
        sudo docker exec $DOCKER_CONTAINER_NAME rm -rf $SCHEMA_FILE
        sudo docker exec $DOCKER_CONTAINER_NAME rm -rf $DUMP_FILE
    "

    Cleanup local schema and dump files
    # rm $SCHEMA_FILE $DUMP_FILE
done

echo "Migration complete."
