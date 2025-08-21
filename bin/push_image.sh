#!/bin/bash

# Docker Hub username
DOCKER_USER="gkibria121"
# Image tag
TAG="latest"

# List of services and their Dockerfile paths (relative to script)
declare -A SERVICES=(
  ["auth"]="../dockerfiles/Dockerfile"
  ["ticket"]="../dockerfiles/Dockerfile"
  ["client"]="Dockerfile"
  ["order"]="../dockerfiles/Dockerfile"
  ["expiration"]="../dockerfiles/Dockerfile"
)

# Loop through each service
for SERVICE in "${!SERVICES[@]}"; do
  DOCKERFILE_PATH="${SERVICES[$SERVICE]}"
  echo "Building and pushing $SERVICE service..."
  
  cd "$SERVICE" || { echo "Failed to enter $SERVICE directory"; exit 1; }

  docker build -t "$DOCKER_USER/microservices-project-2-$SERVICE:$TAG" -f "$DOCKERFILE_PATH" . || { echo "Docker build failed for $SERVICE"; exit 1; }
  docker push "$DOCKER_USER/microservices-project-2-$SERVICE:$TAG" || { echo "Docker push failed for $SERVICE"; exit 1; }

  cd - > /dev/null
done

echo "All services built and pushed successfully!"
