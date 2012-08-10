#!/bin/sh

exception_list=(web/sdk/backplane.js web/sdk/third-party/jquery.js web/sdk/third-party/echo.jquery.noconflict.js)

wrap_file() {
	file=$1
	cp $file $file.tmp
	echo "" > $file
	printf "(function(jQuery) {\nvar $ = jQuery;\n" > $file
	cat $file.tmp >> $file
	printf "})(Echo.jQuery);\n" >> $file
	rm $file.tmp
}

for file in `find web/sdk -name "*.js"`; do
	exception=false
	for _file in ${exception_list[@]}; do
		if [ $file == $_file ]; then
			exception=true;
		fi
	done;
	if [ $exception == false ]; then
		wrap_file $file
	fi
done
