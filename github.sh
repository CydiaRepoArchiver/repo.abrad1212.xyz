#!/bin/bash

git add -A
now=$(date +"%I:%M %m-%d-%Y")
git commit -am "Packages Update - $now"
git push

echo "Success";
