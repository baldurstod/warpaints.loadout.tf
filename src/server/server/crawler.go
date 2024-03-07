package server

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"
)

var MARKET_RENDER_URL = "https://steamcommunity.com/market/search/render/?norender=1"
var re = strings.NewReplacer("Festivized", "", "Specialized", "", "Professional", "", "Killstreak", "")

var paintkitRegexp = regexp.MustCompile("(.*) War Paint")

var crawler *Crawler

type Crawler struct {
	config    *Config
	startPage int
	paintkits map[string]struct{}
}

func StartCrawler(config *Config) {
	crawler = &Crawler{config: config, paintkits: make(map[string]struct{})}
	crawler.initPaintkits()
	go crawler.Start()
}

func (crawler *Crawler) initPaintkits() {
	paintkits, err := findPaintkits()
	if err != nil {
		return
	}

	for _, paintkit := range paintkits {
		crawler.addPaintkit(paintkit.HashName)
	}
}

func (crawler *Crawler) addPaintkit(hashName string) {
	res := paintkitRegexp.FindStringSubmatch(hashName)
	if res != nil && len(res) == 2 {
		crawler.paintkits[res[1]] = struct{}{}
	}
}


func (crawler *Crawler) Start() {
	crawler.startPage = 0
	for {
		crawler.processPage("&sort_column=name&sort_dir=asc&category_440_Quality%5B%5D=tag_paintkitweapon&appid=440")
		time.Sleep(10 * time.Second)
	}
}

func (crawler *Crawler) processPage(parameters string) {
	itemsPerPage := 100
	marketURL := MARKET_RENDER_URL + "&start=" + strconv.Itoa(crawler.startPage) + "&count=" + strconv.Itoa(itemsPerPage) + parameters

	log.Println(marketURL)
	totalCount, err := crawler.request(marketURL)
	log.Println(totalCount, err)

	if err == nil && totalCount > 0 {
		crawler.startPage += itemsPerPage
		if crawler.startPage > totalCount {
			crawler.startPage = 0
		}
	}
}

func (crawler *Crawler) request(marketURL string) (int, error) {
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
		crawler.processListing(&listing)
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

func (crawler *Crawler) processListing(listing *Listing) error {
	/*STEAM_ECONOMY_IMAGE_PREFIX := "https://steamcommunity-a.akamaihd.net/economy/image/"
	log.Println(STEAM_ECONOMY_IMAGE_PREFIX + listing.AssetDescription.IconURL)*/
	//log.Println(listing)

	addListing(listing)
	crawler.addPaintkit(listing.HashName)

	//err = json.NewDecoder(resp.Body).Decode(&marketResult)

	return nil
}

func (crawler *Crawler) getPaintkits() []string {
	var paintkits []string

	for name, _ := range crawler.paintkits {
		//crawler.addPaintkit(paintkit.HashName)
		paintkits = append(paintkits, name)
		log.Println(name)
	}

	return paintkits
}

func cleanupName(name string) string {
	return strings.TrimSpace(re.Replace(name))
}
