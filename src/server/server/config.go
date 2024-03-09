package server

type Config struct {
	HTTP struct {
		Port          int    `json:"port"`
		HttpsKeyFile  string `json:"https_key_file"`
		HttpsCertFile string `json:"https_cert_file"`
	} `json:"http"`
	Database struct {
		ConnectURI string `json:"connect_uri"`
		DBName     string `json:"db_name"`
	} `json:"database"`
	Crawler struct {
		UseCrawler bool `default:"false" json:"use_crawler"`
		PageDelay  int  `default:"10" json:"page_delay"`
	} `json:"crawler"`
}
