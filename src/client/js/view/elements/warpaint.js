import { createElement, shadowRootStyle } from "harmony-ui";
import { STEAM_ECONOMY_IMAGE_PREFIX } from "../../constants";

import warpaintCSS from '../../../css/warpaint.css';

export class WarpaintElement extends HTMLElement {
	#doOnce = true;
	#shadowRoot;
	#htmlPicture;
	#warpaint;

	constructor() {
		super();
		this.#shadowRoot = this.attachShadow({ mode: 'closed' });
		shadowRootStyle(this.#shadowRoot, warpaintCSS);
		this.#htmlPicture = createElement('img', {
			parent: this.#shadowRoot,
		})

	}

	connectedCallback() {
		/*if (this.#doOnce) {
			shadowRootStyle(this.#shadowRoot, contextMenuCSS);
		}*/
	}

	#refresh() {
		this.#htmlPicture.src = STEAM_ECONOMY_IMAGE_PREFIX + this.#warpaint?.iconURL;

	}

	set warpaint(warpaint) {
		console.info(warpaint);
		this.#warpaint = warpaint;
		this.#refresh();
	}
}
customElements.define('loadout-warpaint', WarpaintElement);
