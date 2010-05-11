#!/bin/sh

git checkout production
git merge master
sc-build --languages=en --build=LATEST --clean
git rm -r public/static
cp -r tmp/build/static public/
git add public/.
git commit -m "Deploy to heroku"
git push origin production
git push heroku production:master
git checkout master
