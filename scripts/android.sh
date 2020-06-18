#!/bin/bash
# https://unix.stackexchange.com/questions/175648/use-config-file-for-my-shell-script
source ./scripts/config.shlib;

LEPUS_ROOT=$(pwd)

ROUTER_ADDRESS="-X pkg/nymble/config.RouterAddress=$(config_get host_ip)"
ROUTER_PORT="-X pkg/nymble/config.RouterPort=$(config_get router_port)"
DEBUG_IP="-X pkg/nymble/config.DebugIP=$(config_get host_ip)"
DEBUG_PORT="-X pkg/nymble/config.DebugPort=$(config_get debug_port)"
COUCHDB_ADDRESS="-X pkg/nymble/config.CouchDBAddress=$(config_get host_ip)"
COUCHDB_USER="-X pkg/nymble/config.CouchDBUser=$(config_get couchdb_user)"
COUCHDB_PASSWORD="-X pkg/nymble/config.CouchDBPassword=$(config_get couchdb_password)"

LDFLAGS="${ROUTER_ADDRESS} ${ROUTER_PORT} ${DEBUG_IP} ${DEBUG_PORT} ${COUCHDB_ADDRESS} ${COUCHDB_USER} ${COUCHDB_PASSWORD}"

echo -e "🛠  Building..."
cd go/nymble && gomobile \
bind -o "$LEPUS_ROOT"/android/app/nymble.aar -target=android -tags=debug -ldflags="${LDFLAGS}" > /dev/null

echo -e "🔄  Refresh Gradle dependencies in Android Studio"
