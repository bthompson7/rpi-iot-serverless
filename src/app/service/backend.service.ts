import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError as observableThrowError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  // TODO: replace with prod APIs
  private sensorDataUrl = 'https://xagbd0vv15.execute-api.us-east-1.amazonaws.com/api-test';
  private sensorChartDataUrl = 'https://sck4455qcb.execute-api.us-east-1.amazonaws.com/chart-api-test';
  constructor(private http: HttpClient) {

  }

  getSensorData() {
    console.log("getSensorData");
    return this.http
      .get<any[]>(this.sensorDataUrl)
      .pipe(map(data => data), catchError(this.handleError));
  }


  getSensorChartData() {
    console.log("getSensorData");
    return this.http
      .get<any[]>(this.sensorChartDataUrl)
      .pipe(map(data => data), catchError(this.handleError));
  }

  handleError(res: any) {
    console.error(res.error || res.body.error);
    return observableThrowError(res.error || 'Error fetching data');
  }

}
