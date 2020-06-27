# resume-andrew-paettie

Source of andrewpaettie.com
Basically just a portfolio site to show some things I've done, but also a place to mess around with new frontend technologies on a whim.

# Dev

## Tech Stack
 - bootstrapped with create-react-app
 - routing with react router 4
 - static page snapshot generation via react-snap
 - CI/deployment via CircleCI-Github integration
 - Hosted via AWS S3, CloudFront, Lambda

## Noscript compatibility
Because this site is really static, it was easy to hook up react-snapshot to generate a version of the site which did not require javascript.
This is hooked up in the build step of [package.json](package.json).
The only major thing which does not work in the noscript view is the navbar collapsing.
This does not work because it is a stateful react component, whose open/closed state is controlled by react.

## Dev scripts

 - `npm start` serves files, and re-compile file that changed
 - `npm run lint-fix` runs lint on files changed since last git commit
 - `npm run build` builds minified version ready for deployment

# Ops

## CI

CI will deploy to http://andrewpaettie.test.com.s3-website-us-east-1.amazonaws.com for any branches except master.
For master branch CI will deploy to andrewpaettie.com

It uses the aws cli sync and delete options for the s3 command.

## Email Lambda

Setting up an email address at admin@andrewpaettie.com was necessary to setup
ssl using AWS ACM.  There is a lamda at [lambda/emailForward/](lambda/emailForward/exports.js)
which forwards emails coming from this domain to a verified gmail.

There is not any automation setup around deploying that,
just zip `exports.js`, `package.json`, and `node_modules` into a file
 `exports.zip` which is uploaded to the already setup AWS lambda.

# Links
 - [SSL setup](https://medium.com/@sbuckpesch/setup-aws-s3-static-website-hosting-using-ssl-acm-34d41d32e394)
 - [CircleCI](https://circleci.com/gh/cazlo)
 - [resume doc](https://drive.google.com/drive/folders/0BwF9znNbxADrbVg1emdYcnNockU)
