#!/bin/bash


kubectl create secret generic jwt-secret --from-literal=JWT_KEY="asdf"
kubectl create secret generic database-secrets --from-literal=MONGO_URL="mongodb://mongodb:27017"
kubectl apply -f ./infra/ingress-server.yml