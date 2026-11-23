# resume-andrew-paettie

Source of andrewpaettie.com
Basically just a portfolio site to show some things I've done, but also a place to mess around with new frontend technologies on a whim.

# Dev

## Tech Stack
 - bootstrapped with create-react-app
 - routing with react router 4
 - static page snapshot generation via react-snap
 - CI/deployment via CircleCI-Github integration
 - Hosted via AWS S3 and CloudFront

## Noscript compatibility
Because this site is really static, it was easy to hook up react-snapshot to generate a version of the site which did not require javascript.
This is hooked up in the build step of [package.json](package.json).
The only major thing which does not work in the noscript view is the navbar collapsing.
This does not work because it is a stateful react component, whose open/closed state is controlled by react.

## Installing dependencies

CI (CircleCI) runs a plain `npm ci` against registry.npmjs.org, and the committed
`.npmrc` and `package-lock.json` must keep working that way. Nothing committed
points at the lab registry.

On the home network you can instead install through the lab's Artifact Keeper (AK)
npm proxy (`https://registry.cazlab.link/npm/npm-npmjs/`, anonymous):

    npm run install:ak     # same as: sh scripts/install-via-ak.sh

The script runs `npm ci` via `akdeps run` if `akdeps`
is on PATH, otherwise it sets `NPM_CONFIG_REGISTRY` for that one process. The
registry is switched by environment only; your global `~/.npmrc` is untouched. npm rewrites
the registry host of lockfile entries on the fly, so the lockfile is not modified.

Two independent 7-day cutoffs apply:
 - client side: `min-release-age=7` in `.npmrc` (npm 12), always on, including via AK
 - server side: AK hides versions published less than 7 days ago from package
   metadata, and refuses to serve their tarballs.

HTTP 451 `age_gate_blocked` means the lockfile pins a version that is still younger
than AK's cutoff. Wait for it to age, or install from the public registry
(`npm ci`) while off the home network. The install-script allowlist
(`allowScripts`, `strict-allow-scripts`) applies the same either way.

## Dev scripts

 - `npm start` serves files, and re-compile file that changed
 - `npm run lint-fix` runs lint on files changed since last git commit
 - `npm run build` builds minified version ready for deployment

# Ops

## CI

CI will deploy to http://andrewpaettie.test.com.s3-website-us-east-1.amazonaws.com for any branches except master.
For master branch CI will deploy to andrewpaettie.com

It uses the aws cli sync and delete options for the s3 command.

# Links
 - [SSL setup](https://medium.com/@sbuckpesch/setup-aws-s3-static-website-hosting-using-ssl-acm-34d41d32e394)
 - [CircleCI](https://circleci.com/gh/cazlo)
 - [resume doc](https://drive.google.com/drive/folders/0BwF9znNbxADrbVg1emdYcnNockU)
