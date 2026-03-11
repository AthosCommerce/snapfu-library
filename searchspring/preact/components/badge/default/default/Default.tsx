import { h } from 'preact';
import { jsx, css } from '@emotion/react';
import { CacheProvider } from '@searchspring/snap-preact/components';
import { observer } from 'mobx-react';

const CSS = {
	{{ snapfu.variables.component }}: () => {
		return css({
		});
	},
};

export const {{ snapfu.variables.component }} = observer((props) => {
	
	const { tag, value, parameters } = props;
	const {} = parameters;

	return (
		<CacheProvider>
			<div css={CSS.{{ snapfu.variables.component }}()} className={`ss__badge-{{ snapfu.variables.class }} ss__badge-{{ snapfu.variables.class }}--${tag}`}>{ value }</div>
		</CacheProvider>
	)
});