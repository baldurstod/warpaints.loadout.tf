package server

import (
	"encoding/json"
	"errors"
	_"log"
	"net/http"
)

type ApiHandler struct {
	SteamAPIKey string
}

func (handler ApiHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var body = make(map[string]interface{})
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		jsonError(w, r, errors.New("Bad request"))
		return
	}

	action, ok := body["action"]
	if !ok {
		jsonError(w, r, errors.New("Bad request: no action parameter"))
		return
	}

	switch action {
	case "get-warpaints":
		handler.getWarpaints(w, r, &body)
	case "get-weapon":
		handler.getWeapon(w, r, &body)
	default:
		jsonError(w, r, NotFoundError{})
	}
}

func (handler ApiHandler) getWarpaints(w http.ResponseWriter, r *http.Request, body *map[string]interface{}) {
	p, ok := (*body)["params"]
	if !ok {
		jsonError(w, r, errors.New("Missing params in request"))
		return
	}

	params := p.(map[string]interface{})
	//log.Println(params)


	results, err := findPaintkitsByWear(params["wear"].(string))
	if err != nil {
		jsonError(w, r, errors.New("Error while getting warpaints"))
		return
	}

	jsonSuccess(w, r, results)

	//paintkits := crawler.getPaintkits()

	//jsonSuccess(w, r, paintkits)
}

func (handler ApiHandler) getWeapon(w http.ResponseWriter, r *http.Request, body *map[string]interface{}) {
	p, ok := (*body)["params"]
	if !ok {
		jsonError(w, r, errors.New("Missing params in request"))
		return
	}

	params := p.(map[string]interface{})
	//log.Println(params)

	results, err := findWarpaints(params["weapon"].(string), params["wear"].(string))
	if err != nil {
		jsonError(w, r, errors.New("Error while getting weapon"))
		return
	}

	jsonSuccess(w, r, results)
}
