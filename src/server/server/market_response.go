package server

type MarketResponse struct {
	Success    bool `json:"success"`
	Start      int  `json:"start"`
	Pagesize   int  `json:"pagesize"`
	TotalCount int  `json:"total_count"`

	Listings []Listing `json:"results"`
}
