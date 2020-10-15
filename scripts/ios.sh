#!/bin/bash

source ./scripts/lepus.sh;

echo -e "🛠  Building..."
cp "$ARIES_FRAMEWORK_GO_ROOT"/cmd/aries-agent-mobile/build/ios/AriesAgent.framework "$LEPUS_ROOT"/ios/lepus/AriesAgent.framework

echo -e "✨ xcode should pick up the new framework automagically"