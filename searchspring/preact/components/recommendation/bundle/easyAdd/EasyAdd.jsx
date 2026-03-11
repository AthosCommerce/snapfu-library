import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { observer } from 'mobx-react';
import { RecommendationBundle, Result } from '@searchspring/snap-preact-components';

{{ snapfu.variables.addToCart }}

import './{{ snapfu.variables.component }}.scss';

const EasyAddResult = observer((props) => {
	const { result, seed } = props;

	const resultProps = {
		result: result,
		layout: 'list',
	};

	return (
		!seed && (
			<div class="ss__bundled-result">
				<Result {...resultProps} />
			</div>
		)
	);
});

export const {{ snapfu.variables.component }} = observer((props) => {
	const { controller } = props;
	const store = controller.store;
	const parameters = store?.profile?.display?.templateParameters;

	useEffect(() => {
		if (!controller.store.loaded && !controller.store.loading) {
			controller.search();
		}
	}, []);

	const bundleRecsProps = {
		controller: controller,
		hideCheckboxes: true,
		title: parameters?.title,
		seedText: false,
		ctaButtonText: 'Add Both',
		ctaButtonSuccessText: 'Added!',
		resultComponent: <EasyAddResult />,
		onAddToCart: (e, data) => addToCart(data),
		ctaInline: false,
		limit: 2,
		carousel: {
			enabled: false,
		},
		separatorIcon: false,
	};

	return (
		<div className={'ss__easy-add'}>
			<RecommendationBundle {...bundleRecsProps} />
		</div>
	);
});