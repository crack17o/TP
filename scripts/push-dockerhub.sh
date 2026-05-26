#!/usr/bin/env sh
# Usage : ./scripts/push-dockerhub.sh VOTRE_USER [tag]
set -e

USER_NAME="${1:?Usage: $0 <dockerhub_user> [tag]}"
TAG="${2:-latest}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT"

echo "Build des images..."
docker build -t "${USER_NAME}/todo-backend:${TAG}" ./backend
docker build -t "${USER_NAME}/todo-frontend:${TAG}" ./frontend

echo "Push vers Docker Hub..."
docker push "${USER_NAME}/todo-backend:${TAG}"
docker push "${USER_NAME}/todo-frontend:${TAG}"

echo "Termine. Images :"
echo "  ${USER_NAME}/todo-backend:${TAG}"
echo "  ${USER_NAME}/todo-frontend:${TAG}"
