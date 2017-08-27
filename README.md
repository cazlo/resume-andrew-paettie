# apaettie_backup

Source of andrewpaettie.com
Basically just a portfolio site to show some things I've done, but also a place to mess around with new frontend technologies on a whim.

# Dev scripts

 - `npm start` serves files, and re-compile file that changed
 - `npm run lint-fix` applies linting
 - `npm run build` builds minified version ready for deployment

# CI

CI will deploy to http://andrewpaettie.test.com.s3-website-us-east-1.amazonaws.com for any branches except master.
For master branch CI will deploy to andrewpaettie.com

It uses the aws cli sync and delete options for the s3 command.

# Email Lambda

Setting up an email address at admin@andrewpaettie.com was necessary to setup
ssl using AWS ACM.  There is a lamda at [lamda/emailForward](lamda/emailForward)
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

# Major remaining tasks
 - proofread
 - remove this section