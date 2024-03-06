export class Warpaint {
	#paintkit;
	#weapon;
	#wear;
	#iconURL;
	#sellPrice;
	#sellListings;
	#sellPriceTime;
	#hashName;
	#classID;
	constructor(json) {
		this.#paintkit = json.paintkit;
		this.#weapon = json.weapon;
		this.#wear = json.wear;
		this.#iconURL = json.asset_description?.icon_url;
		this.#sellPrice = json.sell_price;
		this.#sellListings = json.sell_listings;
		this.#sellPriceTime = json.sell_price_time;
		this.#hashName = json.hash_name;
		this.#classID = json.classid;
	}

	get paintkit() {
		return this.#paintkit;
	}

	get weapon() {
		return this.#weapon;
	}

	get wear() {
		return this.#wear;
	}

	get iconURL() {
		return this.#iconURL;
	}

	get sellPrice() {
		return this.#sellPrice;
	}

	get sellListings() {
		return this.#sellListings;
	}

	get sellPriceTime() {
		return this.#sellPriceTime;
	}

	get hashName() {
		return this.#hashName;
	}

	get classID() {
		return this.#classID;
	}
}
