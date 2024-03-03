package server

import (
	"encoding/base64"
	"github.com/gorilla/sessions"
	"log"
	"net/http"
)

var store *sessions.FilesystemStore

func initStore(config *Config) *sessions.FilesystemStore {
	authKey, err := base64.StdEncoding.DecodeString(config.SessionsAuthKey)
	if err != nil {
		log.Println("error:", err)
		return nil
	}

	encryptKey, err := base64.StdEncoding.DecodeString(config.SessionsEncryptKey)
	if err != nil {
		log.Println("error:", err)
		return nil
	}

	store := sessions.NewFilesystemStore(config.SessionsFileStore, authKey, encryptKey)
	store.MaxLength(50000)
	return store
}

func GetSession(r *http.Request) *sessions.Session {
	session, _ := store.Get(r, "session_id")
	return session
}
