#!/bin/sh

sc-build --languages=en --build=LATEST --clean
git rm -r tmp/build
git add .
git commit -m "Deployed `date`"
git push origin production
git push heroku production:master
