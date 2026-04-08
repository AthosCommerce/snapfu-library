#!/bin/bash

if [ $(grep -rHn ".on('afterSearch'" ./src | wc -l) -gt 0 ]; then
    echo "\nFound the following afterSearch middleware that you may need to manually edit. See reference migration https://athoscommerce.github.io/snap/reference-migration \n";

    grep -rHn ".on('afterSearch'" ./src;
fi;