#!/bin/sh
git checkout gh-pages
git checkout master -- grunt.js package.json tools tests src demo
grunt docs
cp -r web/docs/* docs
cp -r web/demo/* demo
git rm -rf grunt.js package.json tools src >/dev/null 2>&1
rm -rf web
git add docs/ tests/ demo/
git commit -m "up"
git push origin gh-pages
git checkout master
