import { createElement, hide, } from 'harmony-ui';

import { Controller } from '../controller'
import { EVENT_TOOLBAR_WEAR_SELECTED } from '../controllerevents';
import { WEAR_LEVELS } from '../constants';

import toolbarCSS from '../../css/toolbar.css';

function createButton(svg, eventName, i18n) {
	return createElement('div', {
		class: 'toolbar-button',
		i18n: { title: i18n, },
		innerHTML: svg,
		events: {
			click: () => Controller.dispatchEvent(new CustomEvent(eventName)),
		},
	});
}

export class Toolbar {
	#htmlElement;
	#htmlPlay;
	#htmlPause;
	#htmlExportFBXButton;
	#htmlExportOBJButton;
	#htmlWearSelector;
	#htmlActivityModifiers;
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
			adoptStyle: toolbarCSS,
			childs: [
				createElement('div', {
					class: 'toolbar-items',
					childs: [
						/*createElement('div', {
							innerText: 'characters',
							events: {
								click: () => Controller.dispatchEvent(new CustomEvent('displaycharacters')),
							},
						}),
						createElement('div', {
							innerText: 'weapons',
							events: {
								click: () => Controller.dispatchEvent(new CustomEvent('displayweapons')),
							},
						}),*/
					],
				}),
				createElement('div', {
					class: 'toolbar-wear',
					childs: [
						this.#htmlWearSelector = createElement('select', {
							class: 'toolbar-wear-selector',
							events: {
								change: event => this.#handleWearSelected(event.target.value),
							},
						}),
					],
				}),
				createElement('div', {
					class: 'toolbar-buttons',
					childs: [
						/*
						this.#htmlPlay = createButton(playSVG, EVENT_TOOLBAR_PLAY, '#play'),
						this.#htmlPause = createButton(pauseSVG, EVENT_TOOLBAR_PAUSE, '#pause'),
						createButton(shareSVG, EVENT_TOOLBAR_SHARE, '#share_current_loadout'),
						createButton(photoCameraSVG, EVENT_TOOLBAR_PICTURE, '#save_picture'),
						this.#htmlExportFBXButton = createButton(viewInArSVG, EVENT_TOOLBAR_EXPORT_FBX, '#export_fbx'),
						this.#htmlExportOBJButton = createButton(print3dSVG, EVENT_TOOLBAR_EXPORT_OBJ, '#export_for_3d_print'),
						createButton(bugReportSVG, EVENT_TOOLBAR_BUG, '#report_bug'),
						createButton(settingsSVG, EVENT_TOOLBAR_OPTIONS, '#options'),
						createButton(manufacturingSVG, EVENT_TOOLBAR_ADVANCED_OPTIONS, '#advanced_options'),
						createButton(moreHorizSVG, EVENT_TOOLBAR_ABOUT, '#about'),
						createButton(patreonLogoSVG, EVENT_TOOLBAR_PATREON, '#patreon'),*/
					]
				}),
			],
		});

		for (const wear of WEAR_LEVELS) {
			createElement('option', {
				parent: this.#htmlWearSelector,
				value: wear,
				innerText: wear,
			});
		}

		hide(this.#htmlPlay);
		return this.#htmlElement;
	}

	get htmlElement() {
		return this.#htmlElement ?? this.#initHTML();
	}

	setMode() {
		/*if (ENABLE_PATREON_POWERUSER) {
			this.#htmlExportOBJButton.classList.remove('disabled');
			this.#htmlExportFBXButton.classList.remove('disabled');
		} else {
			this.#htmlExportOBJButton.classList.add('disabled');
			this.#htmlExportFBXButton.classList.add('disabled');
		}*/
	}

	#handleWearSelected(wear) {
		Controller.dispatchEvent(new CustomEvent(EVENT_TOOLBAR_WEAR_SELECTED, { detail: wear }));
	}

	setWear(wear) {
		this.#htmlWearSelector.value = wear;
	}
}
