#!/bin/bash

# Variables
LOCAL_CASSANDRA_HOST="127.0.0.1"
LOCAL_CASSANDRA_PORT="9042"
GCP_VM_IP="34.93.0.213"  # Replace with your Google Cloud VM IP
DOCKER_CONTAINER_NAME="cass_cluster"  # Replace with your container name
DOCKER_CASSANDRA_PORT="9042"
ADMIN_KEYSPACE="admin"  # Replace with your keyspace name
DUMP_FILE="users.cql"
CQLSH_PATH="C:/apache-cassandra-3.11.6/bin/cqlsh"  # Use forward slashes

# Step 1: Export Schema and Data from Local Cassandra
echo "Exporting schema and data from local Cassandra..."
$CQLSH_PATH $LOCAL_CASSANDRA_HOST $LOCAL_CASSANDRA_PORT -e "COPY $ADMIN_KEYSPACE.users TO '$DUMP_FILE';"  # Replace table_name with actual tables

# Step 2: Transfer the Dump to Google Cloud VM
echo "Transferring dump file to Google Cloud VM..."
scp $DUMP_FILE yashjain200024@$GCP_VM_IP:~/$DUMP_FILE  # Replace your_username with your actual username

# Step 3: Copy the Dump to Docker
echo "Copying dump file to Docker container..."
ssh yashjain200024@$GCP_VM_IP "sudo docker cp ~/$DUMP_FILE $DOCKER_CONTAINER_NAME:/$DUMP_FILE"  # Replace your_username with your actual username

# Step 4: Import Schema and Data into Docker Cassandra
echo "Importing schema and data into Docker Cassandra..."
ssh yashjain200024@$GCP_VM_IP "sudo docker exec  $DOCKER_CONTAINER_NAME cqlsh -e \"COPY $ADMIN_KEYSPACE.users FROM '/$DUMP_FILE';\""  # Replace table_name with actual tables

# Cleanup local dump file
rm $DUMP_FILE
echo "Migration complete."
