import { createElement, hide, show } from 'harmony-ui';

import mainContentCSS from '../../css/maincontent.css';
import warpaintsCSS from '../../css/warpaints.css';

export * from './elements/warpaint.js';
export * from './elements/weapon.js';

export class MainContent {
	#htmlElement;
	#htmlWarpaints;
	constructor() {
		this.#initListeners();
	}

	#initListeners() {
		/*Controller.addEventListener(EVENT_TOOLBAR_PLAY, () => {
			hide(this.#htmlPlay);
			show(this.#htmlPause);

		});
		Controller.addEventListener(EVENT_TOOLBAR_PAUSE, () => {
			show(this.#htmlPlay);
			hide(this.#htmlPause);
		});*/
	}

	#initHTML() {
		this.#htmlElement = createElement('div', {
			attachShadow: { mode: 'closed' },
			adoptStyle: mainContentCSS,
			childs: [
				this.#htmlWarpaints = createElement('div', {
					attachShadow: { mode: 'closed' },
					adoptStyle: warpaintsCSS,
				}),
			],
		});
		return this.#htmlElement;
	}

	get htmlElement() {
		return this.#htmlElement ?? this.#initHTML();
	}

	clearWarpaints() {
		this.#htmlWarpaints.textContent = '';
	}

	addWarpaints(warpaints) {
		for (const warpaint of warpaints) {
			createElement('loadout-warpaint', {
				parent: this.#htmlWarpaints,
				warpaint: warpaint
			});
		}
	}

	addWeapons(weapons) {
		for (const weapon of weapons) {
			createElement('loadout-weapon', {
				parent: this.#htmlWarpaints,
				weapon: weapon
			});
		}
	}
}
