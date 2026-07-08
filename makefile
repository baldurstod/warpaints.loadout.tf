.PHONY: build clean

BINARY_NAME=warpaints.loadout.tf

build:
	go build -ldflags="-X warpaints.loadout.tf/src/server/server.UseEmbed=false" -o dist/${BINARY_NAME} ./src/server/

run: build
	dist/${BINARY_NAME}

prod:
	go env -w CGO_ENABLED=0
	@echo 'Bundling warpaints'
	rollup -c --environment BUILD:production
	@echo 'Building go app'
	go build -o dist/${BINARY_NAME} ./src/server/

clean:
	go clean
