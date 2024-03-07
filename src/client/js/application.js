import { I18n, createElement, documentStyle, shadowRootStyle } from 'harmony-ui';
import { ENABLE_PATREON_BASE, PRODUCTION } from './bundleoptions.js';
import { Toolbar } from './view/toolbar.js';


import htmlCSS from '../css/html.css';
import varsCSS from '../css/vars.css';
import applicationCSS from '../css/application.css';
import toolbarCSS from '../css/toolbar.css';
import maincontentCSS from '../css/maincontent.css';

import english from '../json/i18n/english.json';
import { MainContent } from './view/maincontent.js';
import { Warpaint } from './model/warpaint.js';
import { ServerAPI } from './serverapi.js';
import { PAGE_TYPE_UNKNOWN, PAGE_TYPE_WARPAINT, PAGE_TYPE_WEAPON, PAGE_TYPE_WEAPONS, WEAR_LEVELS } from './constants.js';
import { Controller } from './controller.js';
import { EVENT_TOOLBAR_WEAR_SELECTED } from './controllerevents.js';

documentStyle(htmlCSS);
documentStyle(varsCSS);

class Application {
	#htmlElement;
	#shadowRoot;
	#appToolbar = new Toolbar();
	#appContent = new MainContent();
	#pageType = PAGE_TYPE_UNKNOWN;
	#weaponFilter;
	#warpaintFilter;
	#wearFilter;

	constructor() {
		I18n.setOptions({ translations:[ english ] });
		I18n.start();
		this.#initListeners();
		this.#initHTML();
		this.#setupAnalytics();
		this.#startup();
		addEventListener('popstate', event => this.#startup(event.state ?? {}));
	}

	async #startup(historyState) {
		this.#restoreHistoryState(historyState);
		this.#appContent.clearWarpaints();
		const pathname = document.location.pathname;
		const pathParams = pathname.substring(1).split('/');

		this.#weaponFilter = '';
		this.#warpaintFilter = '';
		this.#wearFilter = WEAR_LEVELS[0];

		switch (true) {
			case pathname.startsWith('/@weapons'):
				this.#pageType = PAGE_TYPE_WEAPONS;
				break;
			case pathname.startsWith('/@weapon'):
				this.#pageType = PAGE_TYPE_WEAPON;
				this.#viewWeapon(pathParams);
				break;
			case pathname.startsWith('/@warpaint'):
				this.#pageType = PAGE_TYPE_WARPAINT;
				this.#viewWeapon(pathParams);
				break;
			default:
				this.#navigateTo('/@weapons');
				break;
		}
	}

	#restoreHistoryState(historyState = {}) {
		// Do stuff
	}

	#navigateTo(url, replaceSate  = false) {
		history[replaceSate ? 'replaceState' : 'pushState']({}, undefined, url);
		this.#startup();
	}

	async #viewWeapon(pathParams) {
		const weaponName = decodeURIComponent(pathParams[1]);
		const wear = this.#checkWear(decodeURIComponent(pathParams[2]));

		this.#weaponFilter = weaponName;
		this.#wearFilter = wear;

		this.#appToolbar.setWear(wear);

		const response = await ServerAPI.getWeapon(weaponName, wear);
		console.log(response);
		const warpaints = [];
		for (const listing of response) {
			const warpaint = new Warpaint(listing);
			warpaints.push(warpaint);
		}
		this.#appContent.addWarpaints(warpaints);
	}

	#checkWear(wear) {
		wear = wear.trim().toLowerCase();
		for (const w of WEAR_LEVELS) {
			if (w.toLowerCase() == wear) {
				return w;
			}
		}

		return WEAR_LEVELS[0];
	}

	#initListeners() {
		Controller.addEventListener(EVENT_TOOLBAR_WEAR_SELECTED, event => this.#changeWear(event.detail));
	}

	#changeWear(wear) {
		this.#wearFilter = this.#checkWear(wear);
		//const pathname = document.location.pathname;
		//const pathParams = pathname.substring(1).split('/');

		const url = this.#buildURL();
		if (url) {
			this.#navigateTo(url);
		}
	}

	#buildURL() {
		switch (this.#pageType) {
			case PAGE_TYPE_WARPAINT:
				return `/@warpaint/${encodeURIComponent(this.#weaponFilter)}/${encodeURIComponent(this.#wearFilter)}`
		}
	}

	#initHTML() {
		this.#htmlElement = createElement('div', {
			className: 'application',
			parent: document.body,
		});
		this.#shadowRoot = this.#htmlElement.attachShadow({ mode: 'closed' });
		I18n.observeElement(this.#shadowRoot);
		this.#initCSS();

		this.#shadowRoot.append(
			this.#appToolbar.htmlElement,
			this.#appContent.htmlElement,
			//this.#appFooter.htmlElement,
		);

		this.#appToolbar.setMode();
		if (ENABLE_PATREON_BASE) {
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		}
	}

	#initCSS() {
		shadowRootStyle(this.#shadowRoot, applicationCSS);
		shadowRootStyle(this.#shadowRoot, maincontentCSS);
		shadowRootStyle(this.#shadowRoot, toolbarCSS);
	}

	#setupAnalytics() {
		if (PRODUCTION) {
			createElement('script', {
				src: `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`,
				parent: document.body,
				async: 1,
			});
			createElement('script', {
				innerText: `window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());

				gtag('config', '${GOOGLE_ANALYTICS_ID}');`,
				parent: document.body,
			});
		}
	}
}
new Application();
