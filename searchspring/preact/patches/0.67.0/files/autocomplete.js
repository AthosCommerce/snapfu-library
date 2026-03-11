
// begin beacon tracking testing
describe.skip('Tracking', () => {
	it('sends beacon events', function () {
		if (typeof config === 'undefined' || !config.url || !config?.selectors?.website?.input || !config?.startingQuery || !config.selectors.autocomplete.result) this.skip();

		const url = config.url;

		cy.visit(url);
		cy.addLocalSnap();

		cy.waitForBundle().then(() => {
			cy.window().then((window) => {
				expect(window.searchspring).to.exist;
			});
		});

		if (config.disableGA) {
			window[`ga-disable-${config.disableGA}`] = true;
		}

		if (config.selectors.website.openInputButton) {
			cy.get(config.selectors.website.openInputButton).first().click({ force: true });
		}

		cy.get(config.selectors.website.input).first().should('exist').focus().type(config.startingQuery, { force: true });

		const firstResult = cy.get(`${config.selectors.autocomplete.result}[href], ${config.selectors.autocomplete.result} a[href]`)
			.first()
			.should('exist')
			.scrollIntoView();

		// impression tracking
		cy.wait(`@beacon2/autocomplete/impression`).then((impression) => {
			expect(impression.response.body).to.have.property('success').to.equal(true);
		});

		// click tracking
		firstResult.trigger('click', { force: true });
		cy.wait(`@beacon2/autocomplete/clickthrough`).then((clickthrough) => {
			expect(clickthrough.response.body).to.have.property('success').to.equal(true);
		});
	});
});
// end beacon tracking testing