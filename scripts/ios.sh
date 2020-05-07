#!/bin/bash

ESQUIVE_ROOT=$(pwd)
HOST_IP=$(ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')

echo -e "🛠  Building..."
cd go/nymble && gomobile bind -o "$ESQUIVE_ROOT"/ios/esquive/nymble.framework -target=ios -tags=debug -ldflags "-X log.HostIP=$HOST_IP" > /dev/null

echo -e "✨ xcode should pick up the new framework automagically"