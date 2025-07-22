#!/usr/bin/env bash
set -euo pipefail

npx openapi-typescript-codegen \
  --input ../oss-catalog/internal/api/openapi.yaml \
  --output src/api \
  --client axios \
  --useOptions \
  --useUnionTypes
