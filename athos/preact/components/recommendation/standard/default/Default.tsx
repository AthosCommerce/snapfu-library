import { h } from 'preact';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'preact/hooks';
import { Recommendation } from '@athoscommerce/snap-preact/components';

import './{{ snapfu.variables.component }}.scss';

export const {{ snapfu.variables.component }} = observer((props) => {
	
	const controller = props.controller;
	const store = controller?.store;

	useEffect(() => {
		if (!controller.store.loaded && !controller.store.loading) {
			controller.search();
		}
	}, []);

	const parameters = store?.profile?.display?.templateParameters;

	return (
		store.results.length > 0 && (
			<Recommendation controller={controller} title={parameters?.title}/>
		)
	);
});