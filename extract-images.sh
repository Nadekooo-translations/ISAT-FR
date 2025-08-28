#!/usr/bin/bash

cd ./isat/img

for i in $(find . -name "*\[Japanese\]*")
do
	mkdir -p ../../img/$(dirname $i)
	cp ${i/\[Japanese\]/[Original]} ../../img/${i/\[Japanese\]/[French]}
done
