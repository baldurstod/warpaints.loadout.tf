import { createElement, hide, show } from 'harmony-ui';

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
			class: 'maincontent',
			childs: [
				this.#htmlWarpaints = createElement('div', {
					class: 'warpaints',
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
