import { createElement, shadowRootStyle } from 'harmony-ui';
import { STEAM_ECONOMY_IMAGE_PREFIX } from '../../constants.js';
import { Controller } from '../../controller.js';
import { EVENT_WARPAINT_CLICK } from '../../controllerevents.js';

import warpaintCSS from '../../../css/warpaint.css';

import weaponsJSON from '../../../json/weapons.json';

export class WeaponElement extends HTMLElement {
	#shadowRoot;
	#htmlPicture;
	#htmlName;
	#weapon;
	#visible = false;

	constructor() {
		super();
		this.#shadowRoot = this.attachShadow({ mode: 'closed' });
		shadowRootStyle(this.#shadowRoot, warpaintCSS);
		this.#shadowRoot.addEventListener('click', () => Controller.dispatchEvent(new CustomEvent(EVENT_WARPAINT_CLICK, { detail: this.#weapon })));
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
			this.#htmlPicture.src = './img/weapons/' + weaponsJSON[this.#weapon];
			this.#htmlName.innerText = this.#weapon;
		}
	}

	set weapon(weapon) {
		this.#weapon = weapon;
		this.#refresh();
	}
}
customElements.define('loadout-weapon', WeaponElement);
