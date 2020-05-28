#!/bin/bash
# https://unix.stackexchange.com/questions/175648/use-config-file-for-my-shell-script
source ./scripts/config.shlib;

ESQUIVE_ROOT=$(pwd)

echo -e "🛠  Building..."
cd go/nymble && gomobile bind -o "$ESQUIVE_ROOT"/ios/esquive/nymble.framework -target=ios > /dev/null

echo -e "✨ xcode should pick up the new framework automagically"