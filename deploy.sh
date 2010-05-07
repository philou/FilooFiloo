#!/bin/sh

sc-build --languages=en --build=LATEST --clean
git rm -r public/static
cp -r tmp/build/static public/
git add .
git commit -m "Deployed `date`"
git push origin production
git push heroku production:master
