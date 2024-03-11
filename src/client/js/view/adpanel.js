import { createElement } from 'harmony-ui';
import { setTimeoutPromise } from 'harmony-utils';
import { ADSBYGOOGLE_INS, ADSBYGOOGLE_SRC } from '../googleconstants.js';

import adCSS from '../../css/ad.css';

const AD_DELAY = 1000;

export class AdPanel {
	#htmlElement;

	#initHTML() {
		this.#htmlElement = createElement('div', {
			attachShadow: { mode: 'closed' },
			adoptStyle: adCSS,
		});


		const sc = createElement('script', {src: ADSBYGOOGLE_SRC, async: 1});
		const ad = createElement('div', {
			parent: document.body,
			style: 'width:300px; height:auto;position:absolute;top:10rem;right:0;z-index:500;',
			innerHTML: ADSBYGOOGLE_INS,
		});

		this.#htmlElement.append(sc);
		(window.adsbygoogle = window.adsbygoogle || []).push({});

		(async () => {
			await setTimeoutPromise(AD_DELAY);
			this.#htmlElement.append(ad);
		})();

		return this.#htmlElement;
	}

	get htmlElement() {
		return this.#htmlElement ?? this.#initHTML();
	}
}
