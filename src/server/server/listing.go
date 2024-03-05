package server

type Listing struct {
	name         string `json:"name"`
	hashName     string `json:"hash_name"`
	sellListings int    `json:"sell_listings"`
	sellPrice    int    `json:"sell_price"`

	assetDescription struct {
		appip      int    `json:"appid"`
		classid    string `json:"classid"`
		instanceid string `json:"instanceid"`
		tradable   int    `json:"tradable"`
		commodity  int    `json:"commodity"`
	} `json:"asset_description"`
}
