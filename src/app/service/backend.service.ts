import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError as observableThrowError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  // TODO: replace with prod APIs
  private sensorDataUrl = 'https://api.homesensor.info/live-data';
  private sensorChartDataUrl = 'https://api.homesensor.info/chart-data';
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
