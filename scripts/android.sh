#!/bin/bash

ESQUIVE_ROOT=$(pwd)
HOST_IP="172.16.1.1"

echo -e "🛠  Building..."
cd go/nymble && gomobile bind -o "$ESQUIVE_ROOT"/android/app/nymble.aar -target=android -tags=debug > /dev/null

echo -e "🔄  Refresh Gradle dependencies in Android Studio"