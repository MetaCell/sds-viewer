#!/bin/bash

# set to the correct cluster context and namespace
kubectl config use-context $CLUSTER_NAME
kubectl config set-context $CLUSTER_NAME --namespace=$NAMESPACE

# prep the yamls
cp sds_viewer_tpl.yaml sds_viewer.yaml
cp ingress_tpl.yaml ingress.yaml

# sds_viewer service and deployment
sed -ie 's/{{TAG}}/'$CF_BUILD_ID'/i' sds_viewer.yaml
sed -ie 's|{{REGISTRY}}|'$REGISTRY'|i' sds_viewer.yaml
kubectl apply -f sds_viewer.yaml

# ingress
sed -ie 's|{{DOMAIN}}|'$DOMAIN'|i' ingress.yaml
kubectl apply -f ingress.yaml

# cleanup
rm -rf sds_viewer.yaml* ingress.yaml*
