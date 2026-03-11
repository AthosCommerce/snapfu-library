import { h, Fragment } from 'preact';
import { useEffect } from 'preact/hooks';
import { observer } from 'mobx-react';
import { RecommendationBundle, Result, Checkbox, Icon } from '@searchspring/snap-preact-components';

{{ snapfu.variables.addToCart }}

import './{{ snapfu.variables.component }}.scss';

const VerticalResult = observer((props) => {
	const { result, selected, seed, onProductSelect } = props;
	
	const resultProps = {
		result: result,
		layout: 'list',
	};

	return (
		<>
			<div class="ss-bundled-result">
				<Checkbox
					className={selected ? 'ss-bundled-result--bundle-checked' : 'ss-bundled-result--bundle-add'}
					icon={selected ? 'check' : 'plus-thin'}
					checked={true}
					size={'20px'}
					onClick={() => onProductSelect(result)}
				/>

				<Result {...resultProps} />
			</div>

			{seed ? (
				<div className="ss-bundled-result__seperator-wrapper">
					<div className="ss-bundled-result__seperator-wrapper__icon-wrapper">
						<Icon icon={'plus-thin'} />
					</div>
				</div>
			) : (
				<></>
			)}
		</>
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
		seedText: 'This Item',
		resultComponent: <VerticalResult />,
		onAddToCart: (e, data) => addToCart(data),
		ctaInline: false,
		limit: 3,
		carousel: {
			enabled: false,
		},
		vertical: true,
		separatorIcon: false,
	};

	return (
		<div className={'ss__vertical-bundle'}>
			<RecommendationBundle {...bundleRecsProps} />
		</div>
	);
});