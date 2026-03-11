import { h } from 'preact';

import { observer } from 'mobx-react-lite';

export const {{ snapfu.variables.component }} = observer((props) => {
	
	const { tag, value, parameters } = props;
	const {} = parameters;

	return (
		<div className={`ss__badge-{{ snapfu.variables.class }} ss__badge-{{ snapfu.variables.class }}--${tag}`}>{ value }</div>
	)
});