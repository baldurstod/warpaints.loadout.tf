import { createElement, I18n } from 'harmony-ui';
import { ADSBYGOOGLE_INS, ADSBYGOOGLE_SRC } from '../googleconstants';

import adCSS from '../../css/ad.css';

export class AdPanel {
	#htmlElement;
	#htmlAdContent;

	#initHTML() {
		this.#htmlElement = createElement('div', {
			attachShadow: { mode: 'closed' },
			adoptStyle: adCSS,
		}).host;

		const ad = createElement('div', {
			parent: document.body,
			style: 'width:300px; height:auto;position:absolute;top:10rem;right:0;z-index:500;',
			innerHTML: ADSBYGOOGLE_INS,
		});

		return this.#htmlElement;
	}

	get htmlElement() {
		return this.#htmlElement ?? this.#initHTML();
	}
}
