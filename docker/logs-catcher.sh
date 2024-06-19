#!/bin/bash

CONTAINER_NAME=$1
SEARCH_STRING=$2
TIMEOUT=$3
INTERVAL=5

elapsed_time=0

while [ $elapsed_time -lt "$TIMEOUT" ]; do
	if docker compose logs "$CONTAINER_NAME" | grep -m 1 "$SEARCH_STRING"; then
		echo "String '$SEARCH_STRING' found in '$CONTAINER_NAME' container logs."
		exit 0
	fi

	echo "Waiting for string '$SEARCH_STRING' in '$CONTAINER_NAME' container logs ($((TIMEOUT - elapsed_time)) seconds left to timeout)..."
	sleep $INTERVAL
	elapsed_time=$((elapsed_time + INTERVAL))
done

echo "Error: Timeout reached or string '$SEARCH_STRING' not found in '$CONTAINER_NAME' container logs."
exit 1
