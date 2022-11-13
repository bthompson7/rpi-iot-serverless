import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private sensorDataUrl = 'https://api.homesensor.info/live-data';
  private sensorChartDataUrl = 'https://api.homesensor.info/chart-data';

  constructor(private http: HttpClient) {

  }

  getSensorData() {
    return this.http
      .get<any[]>(this.sensorDataUrl)
      .pipe(map(data => data), catchError(this.handleError));
  }


  getSensorChartData() {
    return this.http
      .get<any[]>(this.sensorChartDataUrl)
      .pipe(map(data => data), catchError(this.handleError));
  }

  handleError(res: any) {
    console.error("Error fetching data.");
    return throwError(() => new Error('Error fetching data'));
  }

}
