#!/bin/sh

git rm -r tmp/build
sc-build --languages=en --build=LATEST --clean
git add .
git commit -m "Deployed `date`"
git push origin production
git push heroku production:master
