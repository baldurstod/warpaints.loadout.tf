package server

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"
	"strings"
)

var MARKET_RENDER_URL = "https://steamcommunity.com/market/search/render/?norender=1"
var re = strings.NewReplacer("Festivized", "", "Specialized", "", "Professional", "", "Killstreak", "")

type Crawler struct {
	config    *Config
	startPage int
}

func StartCrawler(config *Config) *Crawler {
	crawler := Crawler{config: config}
	crawler.Start()

	return &crawler
}

func (crawler *Crawler) Start() {
	crawler.startPage = 0
	crawler.processPage("&sort_column=name&sort_dir=asc&category_440_Quality%5B%5D=tag_paintkitweapon&appid=440")
}

func (crawler *Crawler) processPage(parameters string) {
	itemsPerPage := 100
	marketURL := MARKET_RENDER_URL + "&start=" + strconv.Itoa(crawler.startPage) + "&count=" + strconv.Itoa(itemsPerPage) + parameters

	log.Println(marketURL)
	totalCount, err := request(marketURL)
	log.Println(totalCount, err)
}

func request(marketURL string) (int, error) {
	resp, err := http.Get(marketURL)

	if err != nil {
		return 0, err
	}

	marketResult := MarketResponse{} //make(map[string]interface{})
	err = json.NewDecoder(resp.Body).Decode(&marketResult)
	if err != nil {
		return 0, err
	}

	log.Println(marketResult.TotalCount)
	if !marketResult.Success {
		return 0, errors.New("Erroneous result from market")
	}

	for _, listing := range marketResult.Listings {
		processListing(&listing)
	}

	/*s, ok := marketResult["success"]
	results, ok2 := marketResult["results"]
	totalCount, ok3 := marketResult["total_count"]
	if !ok || !ok2 || !ok3 || s.(bool) != true {
		return 0, errors.New("Erroneous result from market")
	}*/

	//return int(totalCount.(float64)), processResults(results.([]interface{}))
	return marketResult.TotalCount, nil
}

func processListing(listing *Listing) error {
	/*STEAM_ECONOMY_IMAGE_PREFIX := "https://steamcommunity-a.akamaihd.net/economy/image/"
	log.Println(STEAM_ECONOMY_IMAGE_PREFIX + listing.AssetDescription.IconURL)*/
	log.Println(listing)

	addListing(listing)

	//err = json.NewDecoder(resp.Body).Decode(&marketResult)

	return nil
}

func cleanupName(name string) string {
	return strings.TrimSpace(re.Replace(name))
}
