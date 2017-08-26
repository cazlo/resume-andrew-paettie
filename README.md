# apaettie_backup
===============

Source of andrewpaettie.com
Basically just a portfolio site to show some things I've done, but also a place to mess around with new frontend technologies on a whim.

# Dev scripts

 - `npm start` serves files, and re-compile file that changed
 - `npm run lint-fix` applies linting
 - `npm run build` builds minified version ready for deployment
 - TODO: script to run aws cli and deploy files to s3 bucket

# Major remaining tasks

 - still need to port over content from old site
    - projects
        - add link to this repo
        - less placeholder images
 - landing page needs total redo
    - updated picture?
    - https://reactstrap.github.io/components/
 - css beautification??
 - update PDF resume
 - fix mobile version
   - navbar should be collapsing but isn't
 - proofread
 - https
 -------- initial deployment ----------
 - unit tests not working
   - maybe just delete until there is some behavior worth testing
 - archived could probably be replaced by some pre-rendered version of each route
    - https://www.npmjs.com/package/react-snapshot
 - remove this section