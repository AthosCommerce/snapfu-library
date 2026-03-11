import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { observer } from 'mobx-react';
import { RecommendationBundle } from '@searchspring/snap-preact-components';

import './{{ snapfu.variables.component }}.scss';
{{ snapfu.variables.addToCart }}

export const {{ snapfu.variables.component }} = observer((props) => {
	const controller = props.controller;
	const store = controller?.store;

	useEffect(() => {
		if (!controller.store.loaded && !controller.store.loading) {
			controller.search();
		}
	}, []);

	const parameters = store?.profile?.display?.templateParameters;

	return store.results.length > 0 && <RecommendationBundle controller={controller} onAddToCart={(e, data) => addToCart(data)} title={parameters?.title} />;
});