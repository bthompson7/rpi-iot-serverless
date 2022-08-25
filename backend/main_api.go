package main

import (
	"log"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
)

type SensorData struct{
	Temp string `json:"temp"`
	Humid string `json:"humid"`
	UnixTime string `json:"unixTime"`
	NormalTime string `json:"normalTime"`
}

var (
	temp string
	humid string
	unixTime string
	normalTime string
	firstRow *sql.Rows
	secondRow *sql.Rows
	sensorDataList []SensorData
)

func Handler(request events.APIGatewayProxyRequest) (map[string]SensorData, error) {
	sensorDataList = nil

	db, err := sql.Open("mysql",
	"admin:pass(localhost:3306)/sensor_data")
	if err != nil {
	   log.Fatal(err)
	}
	
	defer db.Close()
	log.Printf("Processing Lambda request %s\n", request.RequestContext.RequestID)

	firstRow, err := db.Query("select temp,humd,UNIX_TIMESTAMP(date) * 1000 as 'unixTime' ,convert_tz(date,'+00:00','-05:00') as 'normalTime' from tempdata2 order by id desc limit 1")
	for firstRow.Next() {
		err := firstRow.Scan(&temp, &humid, &unixTime, &normalTime)
		if err != nil {
			log.Fatal(err)
		}
		sensorDataList = append(sensorDataList, SensorData{Temp:temp,Humid:humid, UnixTime:unixTime, NormalTime:normalTime})
		log.Println(sensorDataList)

	}

	secondRow, err := db.Query("select temp,humd,UNIX_TIMESTAMP(date) * 1000 as 'unixTime' ,convert_tz(date,'+00:00','-05:00') as 'normalTime' from tempdata3 order by id desc limit 1")
	for secondRow.Next() {
		err := secondRow.Scan(&temp, &humid, &unixTime, &normalTime)
		if err != nil {
			log.Fatal(err)
		}
		sensorDataList = append(sensorDataList, SensorData{Temp:temp,Humid:humid, UnixTime:unixTime, NormalTime:normalTime})
	}

	return map[string]SensorData{"basementData": sensorDataList[0], "bedroomData": sensorDataList[1]}, nil

}

func main() {
	lambda.Start(Handler)
}
