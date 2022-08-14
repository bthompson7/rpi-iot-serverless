'''
Lambda function that powers the main api
'''
import json, pymysql
import pymysql.cursors

def lambda_handler(event, context):
    connection = pymysql.connect(host='', user='', password='', database='',    cursorclass=pymysql.cursors.DictCursor)
    print(connection)
    
    with connection:
        with connection.cursor() as cursor:
            selectBasementDataSQL = "select temp,humd,UNIX_TIMESTAMP(date) * 1000 as 'unixTime' ,convert_tz(date,'+00:00','-05:00') as 'normalTime' from tempdata2 order by id desc limit 1"
            cursor.execute(selectBasementDataSQL)
            basementData = cursor.fetchall()

            selectBedroomDataSQL = "select temp,humd,UNIX_TIMESTAMP(date) * 1000 as 'unixTime' ,convert_tz(date,'+00:00','-05:00') as 'normalTime' from tempdata3 order by id desc limit 1"
            cursor.execute(selectBedroomDataSQL)
            bedroomData = cursor.fetchall()
            basementJsonData = basementData[0]['temp'],basementData[0]['humd'], basementData[0]['unixTime'], basementData[0]['normalTime']
            bedroomJsonData = bedroomData[0]['temp'],bedroomData[0]['humd'], bedroomData[0]['unixTime'], bedroomData[0]['normalTime']


            
    return {
    "basementData" : {
        "temp": basementData[0]['temp'],
         "humid": basementData[0]['humd'],
         "last_updated": basementData[0]['unixTime'], 
         "last_updated_normal;" :  json.dumps(basementData[0]['normalTime'], default=str)
    },
    "bedroomData": {
      "temp": bedroomData[0]['temp'],
         "humid": bedroomData[0]['humd'],
         "last_updated": bedroomData[0]['unixTime'],  
         "last_updated_normal;" :  json.dumps(bedroomData[0]['normalTime'], default=str)  
    }
    
    
    

    }


