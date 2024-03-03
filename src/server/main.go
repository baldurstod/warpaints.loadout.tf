package main

import (
	"warpaints.loadout.tf/src/server/server"
	"encoding/json"
	"log"
	"os"
)

func main() {
	config := server.Config{}
	if content, err := os.ReadFile("config.json"); err == nil {
		if err = json.Unmarshal(content, &config); err == nil {
			server.StartServer(&config)
		} else {
			log.Println("Error while reading configuration", err)
		}
	} else {
		log.Println("Error while reading configuration file", err)
	}
}
