package main

import (
	"encoding/json"
	"log"
	"os"
	"warpaints.loadout.tf/src/server/server"
)

func main() {
	config := server.Config{}
	if content, err := os.ReadFile("config.json"); err == nil {
		if err = json.Unmarshal(content, &config); err == nil {
			server.InitMongoDB(&config)
			server.StartCrawler(&config)
			server.StartServer(&config)
		} else {
			log.Println("Error while reading configuration", err)
		}
	} else {
		log.Println("Error while reading configuration file", err)
	}
}
