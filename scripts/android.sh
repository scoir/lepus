#!/bin/bash

ESQUIVE_ROOT=$(pwd)

echo -e "🛠  Building..."
cd go/nymble && gomobile clean && gomobile bind -o $ESQUIVE_ROOT/android/app/nymble.aar -target=android > /dev/null

echo -e "🔄  Refresh Gradle dependencies in Android Studio"