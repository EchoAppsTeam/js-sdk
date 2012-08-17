#!/bin/bash

SRC_DIR=src
BUILD_DIR=.build
WEB_SDK_DIR=web/sdk

DONT_WRAP=(
    $SRC_DIR/backplane.js
    $SRC_DIR/third-party/jquery.js
    $SRC_DIR/third-party/echo.jquery.noconflict.js
)

plugin_header() {
    echo $1 | awk -F . '{ name=""; for (i=1; i<NF-2; i++) { name=name $i "." }; printf "var plugin = Echo.Plugin.manifest(\"%s\", \"%s\");\n\nif (Echo.Plugin.isDefined(plugin)) return;\n\n", $NF, name $(NF-2); }'
}

control_header() {
    printf "if (Echo.Utils.isComponentDefined(\"$class\")) return;\n\n"
}

assemble() {
    mkdir -p .build
    for file in `find $SRC_DIR -name "*.js"`; do
        mkdir -p $BUILD_DIR/`dirname $file`
        tempfile=$BUILD_DIR/$file
        >$tempfile

        skip=false
        for exception in ${DONT_WRAP[@]}; do
            if [ $file == $exception ]; then
                skip=true
            fi
        done
        if [ $skip == true ]; then
            cat $file >> $tempfile
            continue
        fi

        printf "(function(jQuery) {\nvar $ = jQuery;\n\n" >> $tempfile
        class=`grep @class $file | head -1 | awk '{ print $3; }'`
        if [ $class ]; then
            if [ `echo $class | grep "\.Plugins\."` ]; then
                # we don't wrap plugin files atm because they can have 2 plugins in 1 file
                echo;#plugin_header $class >> $tempfile
            else
                control_header $class >> $tempfile
            fi
        else
            echo "File $file is missing '@class' definition"
        fi
        cat $file >> $tempfile
        printf "\n})(Echo.jQuery);\n" >> $tempfile
    done
    cp -r $BUILD_DIR/$SRC_DIR/* $WEB_SDK_DIR
    rm -rf $BUILD_DIR
}

assemble
