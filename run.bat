cls
del .\dist\warpaints.loadout.tf.exe
go build -ldflags="-X warpaints.loadout.tf/src/server/server.UseEmbed=false" -o dist/warpaints.loadout.tf.exe ./src/server/main.go
.\dist\warpaints.loadout.tf.exe
