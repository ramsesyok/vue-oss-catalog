#!/usr/bin/env bash
set -euo pipefail

SPEC_URL="https://raw.githubusercontent.com/ramsesyok/oss-catalog/main/internal/api/openapi.yaml"

npx openapi-typescript-codegen \
  --input "${SPEC_URL}" \
  --output src/api \
  --client axios \
  --useOptions \
  --useUnionTypes
