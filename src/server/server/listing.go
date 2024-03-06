package server

type Listing struct {
	Name         string `json:"name" bson:"name"`
	HashName     string `json:"hash_name" bson:"hash_name"`
	SellListings int    `json:"sell_listings" bson:"sell_listings"`
	SellPrice    int    `json:"sell_price" bson:"sell_price"`

	AssetDescription struct {
		Appip      int    `json:"appid" bson:"appid"`
		Classid    string `json:"classid" bson:"classid"`
		Instanceid string `json:"instanceid" bson:"instanceid"`
		IconURL    string `json:"icon_url" bson:"icon_url"`
		Tradable   int    `json:"tradable" bson:"tradable"`
		Commodity  int    `json:"commodity" bson:"commodity"`
	} `json:"asset_description" bson:"asset_description"`
}
