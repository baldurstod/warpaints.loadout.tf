import { createElement, shadowRootStyle } from 'harmony-ui';
import { STEAM_ECONOMY_IMAGE_PREFIX } from '../../constants.js';
import { Controller } from '../../controller.js';
import { EVENT_WARPAINT_CLICK } from '../../controllerevents.js';

import warpaintCSS from '../../../css/warpaint.css';

export class WarpaintElement extends HTMLElement {
	#doOnce = true;
	#shadowRoot;
	#htmlPicture;
	#htmlName;
	#warpaint;
	#visible = false;

	constructor() {
		super();
		this.#shadowRoot = this.attachShadow({ mode: 'closed' });
		shadowRootStyle(this.#shadowRoot, warpaintCSS);
		this.#shadowRoot.addEventListener('click', () => Controller.dispatchEvent(new CustomEvent(EVENT_WARPAINT_CLICK, { detail: this.#warpaint })));
		this.#htmlPicture = createElement('img', {
			parent: this.#shadowRoot,
		});
		this.#htmlName = createElement('div', {
			class: 'title',
			parent: this.#shadowRoot,
		});
	}

	connectedCallback() {
		const callback = (entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.#setVisible(true);
					observer.unobserve(entry.target);
				}
			});
		};
		new IntersectionObserver(callback, { threshold:0.5 }).observe(this);
	}

	#setVisible(visible) {
		this.#visible = visible;
		if (visible) {
			this.#refresh();
		}
	}

	#refresh() {
		if (this.#visible) {
			this.#htmlPicture.src = STEAM_ECONOMY_IMAGE_PREFIX + this.#warpaint?.iconURL;
			this.#htmlName.innerText = this.#getTitle();
		}
	}

	#getTitle() {
		let title = this.#warpaint?.name;
		title = title.replace(/\(([^(]*)\)$/, '');
		title = title.replace('War Paint', '');
		return title;
	}

	set warpaint(warpaint) {
		this.#warpaint = warpaint;
		this.#refresh();
	}
}
customElements.define('loadout-warpaint', WarpaintElement);
