#!/bin/bash
source ./scripts/lepus.sh;

echo -e "🗑  Cleaning"
rm -f "$LEPUS_ROOT"/android/aries-agent/aries-agent.aar
rm -f "$LEPUS_ROOT"/ios/lepus/AriesAgent.framework