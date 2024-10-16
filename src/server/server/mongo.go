package server

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"strings"
	"time"
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

	listing.LastUpdate = time.Now().Unix()

	filter := bson.D{{"hash_name", listing.HashName}}
	_, err := warpaintsCollection.ReplaceOne(ctx, filter, listing, opts)
	if err != nil {
		return err
	}

	//objectID := res.InsertedID.(primitive.ObjectID)
	return nil
}

func findWarpaints(weapon string, wear string) ([]Listing, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	//filter := bson.D{{"hash_name" : {$regex : weapon}}
	//filter := bson.D{{"hash_name", bson.D{{"$regex", weapon}, {"$options", "i"}}}}

	weapon = strings.Replace(weapon, "(", "\\(", -1)
	weapon = strings.Replace(weapon, ")", "\\)", -1)

	filter := bson.D{
		{"hash_name", primitive.Regex{Pattern: weapon, Options: "i"}},
		{"hash_name", primitive.Regex{Pattern: wear, Options: "i"}},
	}
	opts := options.Find().SetProjection(bson.M{"_id": 0})

	cursor, err := warpaintsCollection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}

	var results []Listing
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}
	/*for _, result := range results {
		log.Println(result)
	}*/

	//objectID := res.InsertedID.(primitive.ObjectID)
	return results, nil
}

func findPaintkits() ([]Listing, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.D{{"hash_name", primitive.Regex{Pattern: "War Paint", Options: "i"}}}

	cursor, err := warpaintsCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var results []Listing
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	return results, nil
}

func findAll() ([]Listing, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.D{}

	cursor, err := warpaintsCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var results []Listing
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	return results, nil
}

func findPaintkitsByWear(wear string) ([]Listing, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.D{
		{"hash_name", primitive.Regex{Pattern: "War Paint", Options: "i"}},
		{"hash_name", primitive.Regex{Pattern: wear, Options: "i"}},
	}

	cursor, err := warpaintsCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var results []Listing
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	return results, nil
}
