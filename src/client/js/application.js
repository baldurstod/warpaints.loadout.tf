import { I18n, createElement, documentStyle, shadowRootStyle } from 'harmony-ui';
import { ENABLE_PATREON_BASE, PRODUCTION } from './bundleoptions';
import { Toolbar } from './view/toolbar';


import htmlCSS from '../css/html.css';
import varsCSS from '../css/vars.css';
import applicationCSS from '../css/application.css';
import toolbarCSS from '../css/toolbar.css';
import maincontentCSS from '../css/maincontent.css';

import english from '../json/i18n/english.json';
import { MainContent } from './view/maincontent';
import { Warpaint } from './model/warpaint';

documentStyle(htmlCSS);
documentStyle(varsCSS);

class Application {
	#htmlElement;
	#shadowRoot;
	#appToolbar = new Toolbar();
	#appContent = new MainContent();
	constructor() {
		I18n.setOptions({ translations:[ english ] });
		I18n.start();
		this.#initHTML();
		this.#setupAnalytics();


		this.#appContent.addWarpaints([
			new Warpaint(),
			new Warpaint(),
			new Warpaint(),
			new Warpaint(),
			new Warpaint(),
			new Warpaint(),
			new Warpaint(),
			new Warpaint(),
			new Warpaint(),
			new Warpaint(),
			new Warpaint(),
			new Warpaint(),
			new Warpaint(),
		]);

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
