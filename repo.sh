#!/bin/bash

DepictionFile="depic.txt"
DepictionFileContents="`cat $DepictionFile`"

rm Packages
rm Packages.bz2
rm Packages.gz

for deb in debs/*.deb
do

	echo "Processing $deb...";
	dpkg-deb -f "$deb" >> Packages
	ar x "$deb" >> Packages
	md5sum "$deb" | echo "MD5sum: $(awk '{ print $1 }')" >> Packages
    wc -c "$deb" | echo "Size: $(awk '{ print $1 }')" >> Packages
    echo "Filename: $deb" >> Packages
    
    echo -n "Depiction Folder Name For $deb > "
    read Depic
    
    #dpkg-deb -f "$deb" Package | echo "Depiction: https://$(head -n 1 CNAME)/depictions/$Depic/index.html" >> Packages
    dpkg-deb -f "$deb" Package | echo "Depiction: $(head -n 1 depic)/?p=$Depic" >> Packages
	echo "" >> Packages

done

bzip2 < Packages > Packages.bz2
gzip -9c < Packages > Packages.gz

git add -A
now=$(date +"%I:%M %m-%d-%Y")
git commit -am "Packages Update - $now"
git push

echo "Updated Github repository with latest packages";