package server

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	//"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
	"log"
)

var cancelConnect context.CancelFunc
var warpaintsCollection *mongo.Collection

func InitMongoDB(config *Config) {
	var ctx context.Context
	ctx, cancelConnect = context.WithCancel(context.Background())
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(config.Database.ConnectURI))
	if err != nil {
		log.Println(err)
		panic(err)
	}

	defer closeMongoDB()

	warpaintsCollection = client.Database(config.Database.DBName).Collection("warpaints")
}

func closeMongoDB() {
	if cancelConnect != nil {
		cancelConnect()
	}
}

func addListing(listing *Listing) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	opts := options.Replace().SetUpsert(true)

	filter := bson.D{{"hash_name", listing.HashName}}
	_, err := warpaintsCollection.ReplaceOne(ctx, filter, listing, opts)
	if err != nil {
		return err
	}

	//objectID := res.InsertedID.(primitive.ObjectID)
	return nil
}
