export class Warpaint {
	#paintkit;
	#weapon;
	#wear;
	#iconURL;
	#sellPrice;
	#sellListings;
	#sellPriceTime;
	#marketHashName;
	#classID;
	constructor(json = {
		paintkit: 'Park Pigmented',
		weapon: 'Bazaar Bargain',
		wear: 'Well-Worn',
		"icon_url": "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTdinxVwPffmYGZYexDHDPQODsot8Qn-XWkw658wDILjo-JeeF3pvNOQYbR9NN1MHcHVD_GGbgv-4xlr0aBcfJKJvmqxiouevZ35",
		"sell_price": 354,
		"sell_listings": 1,
		"sell_price_time": 1661748599,
		"market_hash_name": "Park Pigmented Bazaar Bargain (Well-Worn)",
		"classid": "2570576102"

	}) {
		this.#paintkit = json.paintkit;
		this.#weapon = json.weapon;
		this.#wear = json.wear;
		this.#iconURL = json.icon_url;
		this.#sellPrice = json.sell_price;
		this.#sellListings = json.sell_listings;
		this.#sellPriceTime = json.sell_price_time;
		this.#marketHashName = json.market_hash_name;
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

	get marketHashName() {
		return this.#marketHashName;
	}

	get classID() {
		return this.#classID;
	}
}
