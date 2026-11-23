#!/bin/sh
# Local-only: run `npm ci` through the lab's Artifact Keeper (AK) npm proxy.
# CircleCI cannot reach AK and keeps using registry.npmjs.org; nothing
# committed (.npmrc, package-lock.json) points at AK.
#
# Uses akdeps when it is on PATH, else sets the registry via the environment
# for this process only. Extra arguments are passed to npm ci.
set -eu

AK_NPM_REGISTRY="${AK_NPM_REGISTRY:-https://registry.cazlab.link/npm/npm-npmjs/}"
cd "$(dirname "$0")/.."

if command -v akdeps >/dev/null 2>&1; then
  echo "install-via-ak: using akdeps" >&2
  exec akdeps run --profile "${AKDEPS_PROFILE:-home}" --pilot npm-npmjs -- npm ci "$@"
fi

echo "install-via-ak: akdeps not found, using NPM_CONFIG_REGISTRY=${AK_NPM_REGISTRY}" >&2
NPM_CONFIG_REGISTRY="${AK_NPM_REGISTRY}" npm ci "$@"
