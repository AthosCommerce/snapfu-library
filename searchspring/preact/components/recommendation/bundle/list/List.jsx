import { h, Fragment } from 'preact';
import { useEffect } from 'preact/hooks';
import { observer } from 'mobx-react';
import { RecommendationBundle, Carousel, Image, Price, Button, Checkbox, Icon } from '@searchspring/snap-preact-components';

{{ snapfu.variables.addToCart }}

import './{{ snapfu.variables.component }}.scss';

const CTASlot = observer((props) => {
	const cartStore = props.cartStore;
	const carouselProps = {
		loop: false,
		watchSlidesProgress: true,
		observer: true,
		breakpoints: {
			0: {
				slidesPerView: 2,
				slidesPerGroup: 2,
			},
		},
	};

	return (
		<div className='cta'>
			<div class="cta__inner">
				<Carousel {...carouselProps}>
					{cartStore.items.map((item) => {
						const core = item.display.mappings.core;
						return (
							<div className="cta__inner__image-wrapper">
								<Image src={core.thumbnailImageUrl} alt={core.name} />

								<Icon icon={'plus'} size={20} />
							</div>
						);
					})}
				</Carousel>

				<div>{`${cartStore.count} item${cartStore.count != 1 ? 's' : ''} `}</div>

				<div class="cta__inner__price">
					<div class="cta__inner__price__title">Total Price</div>
					<div class="cta__inner__price__wrapper">
						{cartStore.msrp > cartStore.price && (
							<span class="cta__inner__price__msrp">
								<s>
									<Price value={cartStore.msrp} /> USD
								</s>
							</span>
						)}
						<span class="cta__inner__price__msrp">
							<Price value={cartStore.price} /> USD
						</span>
					</div>
				</div>
			</div>
			<div>
				<Button
					disabled={cartStore.items.length == 0}
					disableStyles
					className={`cta__add-button ${props.addedToCart ? 'cta__add-button--thanks' : ''}`}
					onClick={() => props.onAddToCart()}
				>
					{props.addedToCart ? props.ctaButtonSuccessText : props.ctaButtonText}
				</Button>
			</div>
		</div>
	);
});

const ListResult = observer((props) => {
	const { result, selected, seed, onProductSelect } = props;
	const core = result.display.mappings.core;

	return (
		<>
			<div class="ss__bundled__result">
				<Checkbox
					className={selected ? 'ss__bundled__result--bundle-checked' : 'ss__bundled__result--bundle-add'}
					icon={selected ? 'check' : 'plus-thin'}
					checked={true}
					size={'20px'}
					onClick={() => onProductSelect(result)}
				/>

				<span className="ss__bundled__result__details">
					{seed ? 'This Item: ' : ''}
					{core.name} -
					<div className="ss__bundled__result__pricing">
						{core.msrp && core.price && core.price < core.msrp ? (
							<>
								<Price value={core.msrp} lineThrough={true} />
								&nbsp;
								<Price value={core.price} />
							</>
						) : (
							<Price value={core.price} />
						)}
					</div>
				</span>
			</div>
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
		title: parameters?.title,
		hideCheckboxes: true,
		ctaSlot: <CTASlot />,
		seedText: '',
		resultComponent: <ListResult />,
		onAddToCart: (e, data) => addToCart(data),
		ctaInline: false,
		ctaButtonText: 'Add Bundle',
		ctaButtonSuccessText: 'Added!',
		preselectedCount: 2,
		carousel: {
			enabled: false,
		},
		limit: 4,
		vertical: true,
		separatorIcon: false,
	};

	return (
		<div className={'ss__bundle__list'}>
			<RecommendationBundle {...bundleRecsProps} />
		</div>
	);
});
