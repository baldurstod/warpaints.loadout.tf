package server

import (
	_ "encoding/json"
	"encoding/xml"
	_ "errors"
	_ "log"
	"net/http"
	"net/url"
)

type SiteMapHandler struct {
}

func (handler SiteMapHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	set := SiteMapURLSet{}
	set.AddURL("https://warpaints.loadout.tf/@weapons")
	set.AddURL("https://warpaints.loadout.tf/@warpaints")

	paintkits := crawler.getPaintkits()
	//log.Println(paintkits)
	for _, paintkit := range paintkits {
		set.AddURL("https://warpaints.loadout.tf/@warpaint/" + paintkit)
	}

	weapons := crawler.getWeapons()
	//log.Println(paintkits)
	for _, weapon := range weapons {
		set.AddURL("https://warpaints.loadout.tf/@weapon/" + weapon)
	}

	w.Header().Add("Content-Type", "application/xml")

	out, err := xml.MarshalIndent(set, " ", "  ")
	if err == nil {
		w.Write([]byte(xml.Header))
		w.Write(out)
		return
	}
}

type SiteMapURL struct {
	XMLName xml.Name `xml:"url"`
	Loc     string   `xml:"loc,omitempty"`
}

type SiteMapURLSet struct {
	XMLName xml.Name     `xml:"http://www.sitemaps.org/schemas/sitemap/0.9 urlset"`
	URL     []SiteMapURL `xml:"url"`
}

func (urlSet *SiteMapURLSet) AddURL(loc string) {
	Url, err := url.Parse(loc)
	if err != nil {
		return
	}

	urlSet.URL = append(urlSet.URL, SiteMapURL{Loc: Url.String()})
}

/*
<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

   <url>

      <loc>http://www.example.com/</loc>

      <lastmod>2005-01-01</lastmod>

      <changefreq>monthly</changefreq>

      <priority>0.8</priority>

   </url>

</urlset> */

/*

func (crawler *Crawler) getPaintkits() []string {
	var paintkits []string

	for name := range crawler.paintkits {
		paintkits = append(paintkits, name)
	}

	return paintkits
}

func (crawler *Crawler) getWeapons() []string {
	var weapons []string

	for name := range crawler.weapons {
		weapons = append(weapons, name)
	}

	return weapons
}

*/
