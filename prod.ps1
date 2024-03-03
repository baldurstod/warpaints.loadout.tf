$env:GOOS = 'linux'
$env:GOARCH = 'amd64'

Write-Host "Bundling warpaints.loadout.tf"
Start-Process -FilePath "rollup.cmd" -ArgumentList "-c --environment BUILD:production" -Wait -NoNewWindow

Write-Host "Building go app"
Start-Process -FilePath "go" -ArgumentList "build -o dist/warpaints.loadout.tf ./src/server/main.go" -Wait -NoNewWindow
