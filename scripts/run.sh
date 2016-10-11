#!/bin/bash
export VAULT_ADDR=https://api.qubeship.io
docker rm -f vault-ui
docker run --name vault-ui -d -p 9080:80  -e JWT_SECRET=$JWT_SECRET -e VAULT_ADDR=$VAULT_ADDR vault-ui
