#!/bin/bash

if [ -f "./tests/cypress/support/e2e.js" ]; then
    echo "updating new e2e.js file"
    mv ./patch/files/e2e.js ./tests/cypress/support/e2e.js
fi;

if [ -f "./tests/cypress/e2e/results.cy.js" ]; then
    echo "appending beacon2 tests to results.cy.js"
    cat ./patch/files/results.js >> ./tests/cypress/e2e/results.cy.js
fi;

if [ -f "./tests/cypress/e2e/autocomplete.cy.js" ]; then
    echo "appending beacon2 tests to autocomplete.cy.js"
    cat ./patch/files/autocomplete.js >> ./tests/cypress/e2e/autocomplete.cy.js
fi;