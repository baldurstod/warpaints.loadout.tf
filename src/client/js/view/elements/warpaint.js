import { createElement, shadowRootStyle } from "harmony-ui";
import { STEAM_ECONOMY_IMAGE_PREFIX } from "../../constants";

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
		this.#htmlPicture = createElement('img', {
			parent: this.#shadowRoot,
		});
		this.#htmlName = createElement('div', {
			class: 'name',
			parent: this.#shadowRoot,
		})

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
			this.#htmlName.innerText = this.#warpaint?.name;
		}
	}

	set warpaint(warpaint) {
		console.info(warpaint);
		this.#warpaint = warpaint;
		this.#refresh();
	}
}
customElements.define('loadout-warpaint', WarpaintElement);
