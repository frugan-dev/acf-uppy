#!/bin/bash

CONTAINER_NAME=$1
SEARCH_STRING=$2
TIMEOUT=$3

if timeout "$TIMEOUT" bash -c "
    docker compose logs -f $CONTAINER_NAME | grep -m 1 '$SEARCH_STRING'
"; then
	echo "String '$SEARCH_STRING' found in '$CONTAINER_NAME' container logs."
else
	echo "Error: Timeout reached or string '$SEARCH_STRING' not found in '$CONTAINER_NAME' container logs."
	exit 1
fi
