#!/bin/bash

for jsonFile in $(grep -rl 'snap/recommendation/email' . --include '*.json' | grep 'Email.json'); do
    dir=$(dirname "$jsonFile")
    base=$(basename "$jsonFile" .json)
    jsxFile="$dir/$base.jsx"
    scssFile="$dir/$base.scss"

    name=$(jq -r '.name' $jsonFile)

    if [ "$name" = "null" ]; then
        echo "name property in $jsonFile is not found"
        continue
    fi

    snapfu recs archive $name production --ci
    status=$?
    if [ $status -eq 0 ]; then
        echo "snapfu successfully archived $name"
        
        # delete json file
        if [ -f $jsonFile ]; then
            echo "Deleting $jsonFile"
            rm $jsonFile
        fi

        # delete jsx file
        if [ -f $jsxFile ]; then
            echo "Deleting $jsxFile"
            rm $jsxFile
        fi

        # delete scss file
        if [ -f $scssFile ]; then
            echo "Deleting $scssFile"
            rm $scssFile
        fi

        # remove empty directory
        if [ -z "$(ls -A $dir)" ]; then
            echo "Deleting empty directory $dir"
            rm -rf $dir
        fi
    else
        echo "failed to archive $name"
        continue
    fi

done
