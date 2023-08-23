#!/bin/bash

export CLUSTER_NAME=minikube
export NAMESPACE=sds_viewer
export CF_BUILD_ID=latest
export REGISTRY=
export DOMAIN=sds_viewer.local

source ./deploy.sh
