#!/bin/bash
# bash script for moving from Cypress 8.5.0 -> 12.15.0

# check if we need to migrate
if [ -f "./tests/cypress.json" ]; then
    # create new spec file directory
    mkdir -p ./tests/cypress/e2e

    # if integration directory exists, and is not empty
    if [ -d "./tests/cypress/integration" ]; then
        if [ -n "$(ls ./tests/cypress/integration)" ]; then
            echo "moving spec files to ./tests/cypress/e2e"
            cp ./tests/cypress/integration/* ./tests/cypress/e2e
        else
            echo "no spec files found to copy"
        fi

        rm -rf ./tests/cypress/integration

        # rename spec files if they exist
        if [ -n "$(ls ./tests/cypress/e2e/*.spec.js)" ]; then 
            for file in ./tests/cypress/e2e/*.spec.js; do
                echo "renaming spec file: $file -> ${file%.spec.js}.cy.js"
                mv -- "$file" "${file%.spec.js}.cy.js"
            done
        else
            echo "no spec files found to rename"
        fi
    fi

    mv ./tests/cypress/support/index.js ./tests/cypress/support/e2e.js

    rm ./tests/cypress.json

    cp ./patch/tests/cypress.config.js ./tests/cypress.config.js
    cp ./patch/tests/cypress/support/commands.js ./tests/cypress/support/commands.js
fi