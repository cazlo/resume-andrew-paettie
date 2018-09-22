# apaettie_backup

Source of andrewpaettie.com
Basically just a portfolio site to show some things I've done, but also a place to mess around with new frontend technologies on a whim.

# Dev

## Tech Stack
 - bootstrapped with create-react-app
 - bootstrap 4 via reactstrap
 - routing with react router 4
 - static page snapshot generation via react-snapshot
 - CI/deployment via CircleCI-Github integration
 - Hosted via AWS S3, CloudFront, Lambda

## Noscript compatibility
Because this site is really static, it was easy to hook up react-snapshot to generate a version of the site which did not require javascript.
This is hooked up in [`"build": "react-scripts build && react-snapshot",`](package.json).
The only major thing which does not work in the noscript view is the navbar collapsing.
This does not work because it is a stateful react component, whose open/closed state is controlled by react.

## Dev scripts

 - `yarn start` serves files, and re-compile file that changed
 - `yarn run lint-fix` applies linting
 - `yarn run build` builds minified version ready for deployment

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
 - [Reactstrap - Bootstrap 4 React Components](https://reactstrap.github.io/components/)
 - [Bootstrap 4 Components](https://v4-alpha.getbootstrap.com/components/)
 - [FontAwesome Icons](http://fontawesome.io/icons/)
 - [React-Snapshot: pre-rendering DOM](https://www.npmjs.com/package/react-snapshot)
 - [SSL setup](https://medium.com/@sbuckpesch/setup-aws-s3-static-website-hosting-using-ssl-acm-34d41d32e394)
 - [CircleCI](https://circleci.com/gh/cazlo)
 - [resume doc](https://drive.google.com/drive/folders/0BwF9znNbxADrbVg1emdYcnNockU)
