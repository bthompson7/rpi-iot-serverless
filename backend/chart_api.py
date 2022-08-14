'''
Lambda function that powers the chart api
'''
import json, pymysql
import pymysql.cursors

def lambda_handler(event, context):
    connection = pymysql.connect(host='', user='', password='', database='',    cursorclass=pymysql.cursors.DictCursor)
    print(connection)
    with connection:
        with connection.cursor() as cursor:
            selectBasementDataSQL = "select id, temp, humd, date  from(select * from tempdata2 order by id desc limit 60)Var1 order by id asc"           
            cursor.execute(selectBasementDataSQL)
            basementData = cursor.fetchall()

            selectBedroomDataSQL = "select id, temp, humd, date from(select * from tempdata3 order by id desc limit 60)Var1 order by id asc"      
            cursor.execute(selectBedroomDataSQL)
            bedroomData = cursor.fetchall()

            
    return {
        'data' : {
            'basementChartData' : basementData,
            'bedroomChartData' : bedroomData
        }
             
             
         
    }