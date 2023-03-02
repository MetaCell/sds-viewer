#!/bin/bash

# Setup script for creating a minikube instance and build the needed applications

minikube start --memory 4000 --cpus 2 --disk-size 40g --driver=docker --kubernetes-version=v1.21.2
minikube addons enable ingress

# make sure we are on minikube
kubectl config use-context minikube

kubectl create ns sds_viewer
kubectl create rolebinding sds_viewer-default --clusterrole=admin --serviceaccount=sds_viewer:default -n sds_viewer

eval $(minikube docker-env)
kubectl config use-context minikube
