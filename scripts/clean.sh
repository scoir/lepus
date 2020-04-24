#!/bin/bash

echo -e "🗑  Cleaning"
rm -f ./android/app/nymble.aar > /dev/null
rm -f ./android/app/nymble-sources.jar > /dev/null
cd go/nymble && gomobile clean