#!/usr/bin/env bash

echo -e "🖊  Writing local config"
cat > config/local.conf <<EOF
host_ip=$(ip -o -4 addr list wlp59s0 | awk '{print $4}' | cut -d/ -f1)
EOF
