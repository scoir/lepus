#!/bin/bash
# https://unix.stackexchange.com/questions/175648/use-config-file-for-my-shell-script
source ./scripts/config.shlib;

ESQUIVE_ROOT=$(pwd)

ROUTER_ADDRESS="-X pkg/nymble/config.RouterAddress=$(config_get host_ip)"
ROUTER_PORT="-X pkg/nymble/config.RouterPort=$(config_get router_port)"
DEBUG_IP="-X pkg/nymble/config.DebugIP=$(config_get host_ip)"
DEBUG_PORT="-X pkg/nymble/config.DebugPort=$(config_get debug_port)"

LDFLAGS="${ROUTER_ADDRESS} ${ROUTER_PORT} ${DEBUG_IP} ${DEBUG_PORT}"

echo -e "🛠  Building..."
cd go/nymble && gomobile \
bind -o "$ESQUIVE_ROOT"/android/app/nymble.aar -target=android -tags=debug -ldflags="${LDFLAGS}" > /dev/null

echo -e "🔄  Refresh Gradle dependencies in Android Studio"