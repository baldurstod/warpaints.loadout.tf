import { I18n, createElement, documentStyle, shadowRootStyle } from 'harmony-ui';
import { themeCSS } from 'harmony-css';
import { ENABLE_PATREON_BASE, PRODUCTION } from './bundleoptions.js';
import { Toolbar } from './view/toolbar.js';


import htmlCSS from '../css/html.css';
import applicationCSS from '../css/application.css';
import mainPanelCSS from '../css/mainpanel.css';

import english from '../json/i18n/english.json';
import { MainContent } from './view/maincontent.js';
import { Warpaint } from './model/warpaint.js';
import { ServerAPI } from './serverapi.js';
import { PAGE_TYPE_UNKNOWN, PAGE_TYPE_WARPAINT, PAGE_TYPE_WARPAINTS, PAGE_TYPE_WEAPON, PAGE_TYPE_WEAPONS, STEAM_MARKET_SEARCH_URL, WEAR_LEVELS } from './constants.js';
import { Controller } from './controller.js';
import { EVENT_TOOLBAR_WEAR_SELECTED, EVENT_WARPAINT_CLICK } from './controllerevents.js';
import { GOOGLE_ANALYTICS_ID } from './googleconstants.js';
import { AdPanel } from './view/adpanel.js';

documentStyle(htmlCSS);
documentStyle(themeCSS);

class Application {
	#htmlElement;
	#shadowRoot;
	#appToolbar = new Toolbar();
	#appContent = new MainContent();
	#appAd = new AdPanel();
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
			case pathname.startsWith('/@warpaints'):
				this.#pageType = PAGE_TYPE_WARPAINTS;
				this.#viewWarpaints(pathParams);
				break;
			case pathname.startsWith('/@weapons'):
				this.#pageType = PAGE_TYPE_WEAPONS;
				this.#viewWeapons();
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

	async #viewWarpaints(pathParams) {
		const wear = this.#checkWear(decodeURIComponent(pathParams[1]));
		this.#wearFilter = wear;
		this.#appToolbar.setWear(wear);

		const response = await ServerAPI.getWarpaints(wear) ?? [];
		const warpaints = [];
		for (const listing of response) {
			const warpaint = new Warpaint(listing);
			warpaints.push(warpaint);
		}
		this.#appContent.addWarpaints(warpaints);
	}

	async #viewWeapons() {
		const response = await ServerAPI.getWeapons() ?? [];
		const weapons = [];
		for (const listing of response) {
			weapons.push(listing);
		}
		this.#appContent.addWeapons(weapons);
	}

	async #viewWeapon(pathParams) {
		const weaponName = decodeURIComponent(pathParams[1]);
		const wear = this.#checkWear(decodeURIComponent(pathParams[2]));

		this.#weaponFilter = weaponName;
		this.#wearFilter = wear;

		this.#appToolbar.setWear(wear);

		const response = await ServerAPI.getWeapon(weaponName, wear) ?? [];
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
		Controller.addEventListener(EVENT_WARPAINT_CLICK, event => this.#warPaintClick(event.detail));
	}

	#changeWear(wear) {
		this.#wearFilter = this.#checkWear(wear);
		//const pathname = document.location.pathname;
		//const pathParams = pathname.substring(1).split('/');

		this.#buildURL(this.#pageType, this.#weaponFilter, this.#wearFilter);
	}

	#warPaintClick(warpaint) {
		console.info(warpaint);
		switch (this.#pageType) {
			case PAGE_TYPE_WARPAINTS:
				this.#buildURL(PAGE_TYPE_WARPAINT, warpaint.getWarPaintName(), this.#wearFilter);
				break;
			case PAGE_TYPE_WARPAINT:
			case PAGE_TYPE_WEAPON:
				open(`${STEAM_MARKET_SEARCH_URL}"${warpaint.hashName.replace(/\((.*)\)$/, '')}"`);//Remove wear
				break;
			case PAGE_TYPE_WEAPONS:
				this.#buildURL(PAGE_TYPE_WEAPON, warpaint, this.#wearFilter);
				break;
			default:
				break;
		}
	}

	#buildURL(pageType, weaponFilter, wearFilter) {
		let url;
		switch (pageType) {
			case PAGE_TYPE_WARPAINT:
				url = `/@warpaint/${encodeURIComponent(weaponFilter)}/${encodeURIComponent(wearFilter)}`;
				break;
			case PAGE_TYPE_WARPAINTS:
				url = `/@warpaints/${encodeURIComponent(wearFilter)}`;
				break;
			case PAGE_TYPE_WEAPON:
				url = `/@weapon/${encodeURIComponent(weaponFilter)}/${encodeURIComponent(wearFilter)}`;
				break;
		}
		if (url) {
			this.#navigateTo(url);
		}
	}

	#initHTML() {
		this.#htmlElement = createElement('div', {
			parent: document.body,
			attachShadow: { mode: 'closed' },
			adoptStyle: applicationCSS,
			childs: [
				this.#appToolbar.htmlElement,
				createElement('div', {
					parent: document.body,
					attachShadow: { mode: 'closed' },
					adoptStyle: mainPanelCSS,
					childs: [
						this.#appContent.htmlElement,
						this.#appAd.htmlElement,
					],
				}),
			],
		});
		//this.#shadowRoot = this.#htmlElement.attachShadow({ mode: 'closed' });
		//I18n.observeElement(this.#shadowRoot);
		//this.#initCSS();

		/*this.#shadowRoot.append(
			//this.#appFooter.htmlElement,
		);*/

		this.#appToolbar.setMode();
		/*if (ENABLE_PATREON_BASE) {
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		}*/
	}

	#initCSS() {
		/*shadowRootStyle(this.#shadowRoot, applicationCSS);
		shadowRootStyle(this.#shadowRoot, maincontentCSS);
		shadowRootStyle(this.#shadowRoot, toolbarCSS);*/
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
