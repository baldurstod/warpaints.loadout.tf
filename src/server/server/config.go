package server

type Config struct {
	Port                int    `json:"port"`
	HttpsKeyFile        string `json:"https_key_file"`
	HttpsCertFile       string `json:"https_cert_file"`
	SessionsFileStore   string `json:"sessions_file_store"`
	SessionsAuthKey     string `json:"sessions_auth_key"`
	SessionsEncryptKey  string `json:"sessions_encrypt_key"`
	PatreonClientID     string `json:"patreon_client_id"`
	PatreonClientSecret string `json:"patreon_client_secret"`
	PatreonRedirectURL  string `json:"patreon_redirect_url"`
	PatreonCreatorID    string `json:"patreon_creator_id"`
}