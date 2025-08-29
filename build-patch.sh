#!/usr/bin/bash

DIFF=$(diff -qr isat isat-orig | perl -n -e '/Files isat\/([a-zA-Z0-9\/.-_ \[\]]+) and / && print $1."\n"')

mkdir patch

for i in $DIFF
do
	cp --parents isat/$i patch
done

mv patch/isat patch/www

cd patch && zip -r patch.zip * && cd ..

mv patch/patch.zip .
