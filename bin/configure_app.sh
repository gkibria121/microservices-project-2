#!/bin/bash


kubectl create secret generic jwt-secret --from-literal=JWT_KEY="asdf"
kubectl apply -f ./infra/ingress-server.yml