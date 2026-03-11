import { h, Fragment } from 'preact';
import { observer } from 'mobx-react';
import classnames from 'classnames';

import { Result } from '@searchspring/snap-preact-components';

import './{{ snapfu.variables.component }}.scss';

/**
 * COMPONENT MUST BE FULLY SELF-CONTAINED
 *
 * Intended to render results to generate images for email recommendations.
 * 
 * Details:
 *  - component should not render a grid (1 result per line)
 *  - cannot tie into external scripting
 *  - all styling and fonts must be bundled
 *  - lazy loading should be disabled
 *  - each result must have id={`ss-emailrec${index}`}
 *  - results should not contain any interactive elements (ie. image pagination arrows, color swatches)
 * 
 * Test:
 *  - https://localhost:3333/email.html
 * 
 **/

export const {{ snapfu.variables.component }} = observer((props) => {
	const controller = props.controller;
	const store = controller?.store;

	return ( 
		store.results.length > 0 && (
			<Fragment>
				{store.results.map((result, idx) => (
					/* THIS OUTER "ss-emailrec" WRAPPER SHOULD NOT BE REMOVED, IT IS REQUIRED */
					<div key={idx} id={`ss-emailrec${idx}`} style={{ display: 'block', width: '240px' }}>
						{/* BEGIN result component changes */}
						<Result
							controller={controller}
							result={result}
							hideBadge
							theme={{
								components: {
									image: {
										// lazy loading should be disabled
										lazy: false,	
									},
								},
							}} />
						{/* END result component changes */}
					</div>
				))}
			</Fragment>
		)
	);
});