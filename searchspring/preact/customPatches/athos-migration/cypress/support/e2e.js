// DO NOT EDIT - THIS FILE CAN/WILL BE REPLACED!!!
// ***********************************************
// Custom Snap Cypress Configuration
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************

import 'cypress-fail-fast';

// Import commands.js using ES2015 syntax:
import './commands';
import './custom';
import { ignoredErrors } from './custom';

// ignore 3rd party uncaught exceptions - but not bundle exceptions
Cypress.on('uncaught:exception', (err) => {
	if (ignoredErrors?.length) {
		for (let i = 0; i < ignoredErrors.length; i++) {
			const checkFor = new RegExp(ignoredErrors[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
			if (err.stack.match(checkFor)) {
				return false;
			}
		}
	}

	if (err.stack.match(/\/\/localhost:\d+\/bundle\./)) {
		return true;
	}

	return false;
});

beforeEach(() => {
	// make references to requests available
	cy.intercept(/.*athoscommerce\.net\/v1\/search/).as('search');
	cy.intercept(/.*athoscommerce\.net\/v1\/autocomplete/).as('autocomplete');

	// prevent searchspring assets and requests
	cy.intercept(/.*searchspring\.io\/*/, (req) => {
		req.destroy();
	});
	cy.intercept(/.*searchspring\.net\/*/, (req) => {
		req.destroy();
	});

	// prevent snap assets
	cy.intercept(/.*snapui.searchspring\.io\/.*.js.*$/, (req) => {
		req.destroy();
	});
	cy.intercept(/.*snapui.athoscommerce\.io\/.*.js.*$/, (req) => {
		req.destroy();
	});

	cy.intercept('POST', /analytics\.athoscommerce\.net\/beacon\/v2\/.*\/autocomplete\/impression/, { success: true }).as('beacon2/autocomplete/impression');
	cy.intercept('POST', /analytics\.athoscommerce\.net\/beacon\/v2\/.*\/autocomplete\/clickthrough/, { success: true }).as('beacon2/autocomplete/clickthrough');
	cy.intercept('POST', /analytics\.athoscommerce\.net\/beacon\/v2\/.*\/search\/impression/, { success: true }).as('beacon2/search/impression');
	cy.intercept('POST', /analytics\.athoscommerce\.net\/beacon\/v2\/.*\/search\/clickthrough/, { success: true }).as('beacon2/search/clickthrough');
	cy.intercept('POST', /analytics\.athoscommerce\.net\/beacon\/v2\/.*\/category\/impression/, { success: true }).as('beacon2/category/impression');
	cy.intercept('POST', /analytics\.athoscommerce\.net\/beacon\/v2\/.*\/category\/clickthrough/, { success: true }).as('beacon2/category/clickthrough');
});