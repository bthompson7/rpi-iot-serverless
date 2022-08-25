package main

import (
	"log"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
)

type SensorData struct{
	Id string `json:"id"`
	Temp string `json:"temp"`
	Humid string `json:"humid"`
	NormalTime string `json:"normalTime"`
}

var (
	id string
	temp string
	humid string
	normalTime string
	firstRow *sql.Rows
	secondRow *sql.Rows
	basementChartData []SensorData
	bedroomChartData []SensorData

)

func Handler(request events.APIGatewayProxyRequest) (map[string][]SensorData, error) {
	basementChartData = nil
	bedroomChartData = nil

	db, err := sql.Open("mysql",
	"admin:pass(localhost:3306)/sensor_data")
	if err != nil {
	   log.Fatal(err)
	}
	
	defer db.Close()
	log.Printf("Processing Lambda request %s\n", request.RequestContext.RequestID)

	firstRow, err := db.Query("select id, temp, humd, date  from(select * from tempdata2 order by id desc limit 60)Var1 order by id asc")
	for firstRow.Next() {
		err := firstRow.Scan(&id, &temp, &humid, &normalTime)
		if err != nil {
			log.Fatal(err)
		}
		basementChartData = append(basementChartData, SensorData{Id:id, Temp:temp,Humid:humid, NormalTime:normalTime})
	}

	secondRow, err := db.Query("select id, temp, humd, date  from(select * from tempdata3 order by id desc limit 60)Var1 order by id asc")
	for secondRow.Next() {
		err := secondRow.Scan(&id, &temp, &humid, &normalTime)
		if err != nil {
			log.Fatal(err)
		}
		bedroomChartData = append(bedroomChartData, SensorData{Id:id, Temp:temp,Humid:humid, NormalTime:normalTime})
	}

	db.Close()
	return map[string][]SensorData{"basementData": basementChartData, "bedroomData": bedroomChartData},nil
}

func main() {
	lambda.Start(Handler)
}
